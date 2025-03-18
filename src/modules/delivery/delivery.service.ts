import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateDeliveryDto,
  DeliveryStatus,
  EstimateDeliveryDto,
  FindDeliveryDto,
} from './dto/delivery.dto';
import { AppConfigService } from '../app-config/app-config.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderShipment } from '../order/entities/order-shipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';
import { DeliveryItem } from './entities/delivery-item.entity';
import { HelperService } from 'src/utilities/helper.service';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';

@Injectable()
export class DeliveryService {
  private apiKey;
  private url;

  constructor(
    private configService: ConfigService,
    private appConfig: AppConfigService,
    private httpService: HttpService,
    @InjectRepository(OrderShipment)
    private readonly shipmentRepository: Repository<OrderShipment>,
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @InjectRepository(DeliveryItem)
    private readonly deliveryItemRepository: Repository<DeliveryItem>,
    private helperService: HelperService,
  ) {
    this.apiKey = this.configService.get<string>('gokada.key');
    this.url = this.configService.get<string>('gokada.url');
  }

  async estimate(request: EstimateDeliveryDto) {
    const config = await this.pickupLocation();
    const payload = {
      api_key: this.apiKey,
      service_mode: request.serviceMode, //immediate
      pickup_address: config.pickupAddress.description,
      pickup_latitude: config.pickupAddress.lat,
      pickup_longitude: config.pickupAddress.lng,
      dropoffs: request.addresses.map((address) => {
        return {
          address: address.description,
          latitude: address.lat,
          longitude: address.lng,
        };
      }),
    };

    const response = await this.makeRequest(
      payload,
      'developer/order_estimate',
    );

    console.log(response);

    if (response.fare) {
      return response.fare.replace(/(\d+)\s*-\s*(\d+)/, (_, val1, val2) => {
        return `₦${Number(val1).toLocaleString()} to ₦${Number(val2).toLocaleString()}`;
      });
    }

    throw new ServiceUnavailableException(
      'unable to fetch estimate at this time, please try again later',
    );
  }

  async makeRequest(payload, path: string) {
    console.log('PAYLOAD', payload);
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.url}${path}`, payload),
      );
      console.log('RESPONSE', response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data.errors);
      throw new BadRequestException(
        error?.response?.data?.message ??
          error.response?.data ??
          error.response,
      );
    }
  }

  async create(request: CreateDeliveryDto) {
    for (const shipmentId of request.shipmentIds) {
      const exist = await this.deliveryItemRepository.findOne({
        where: { shipmentId },
        relations: ['delivery', 'shipment', 'shipment.order'],
      });
      if (exist && exist.delivery.status != DeliveryStatus.canceled) {
        throw new BadRequestException(
          `shipment with order reference ${exist.shipment.order.reference} already exist`,
        );
      }
    }
    const shipments = await this.shipmentRepository.find({
      where: {
        id: In(request.shipmentIds),
      },
      relations: ['order', 'order.user'],
    });
    const config = await this.pickupLocation();
    const payload = {
      api_key: this.apiKey,
      service_mode: request.serviceMode, //immediate
      pickup_address: config.pickupAddress.description,
      pickup_latitude: config.pickupAddress.lat,
      pickup_longitude: config.pickupAddress.lng,
      pickup_customer_name: config.pickupName,
      pickup_customer_email: config.pickupEmail,
      pickup_customer_phone: config.pickupPhone,
      pickup_datetime: request.pickupDate,
      dropoffs: shipments.map((shipment) => {
        return {
          customer_name: `${shipment.order.user.firstName} ${shipment.order.user.lastName}`,
          customer_phone: shipment.order.user.phone,
          customer_email: shipment.order.user.email,
          address: shipment.address.description,
          latitude: shipment.address.lat,
          longitude: shipment.address.lng,
        };
      }),
    };

    const create = await this.makeRequest(payload, 'developer/order_create');
    const createDelivery = this.deliveryRepository.create({
      reference: `DLV-${this.helperService.generateRandomAlphaNum(10)}`,
      providerOrderId: create.order_id,
    });
    const delivery = await this.deliveryRepository.save(createDelivery);

    for (const shipmentId of request.shipmentIds) {
      const createDeliveryItem = this.deliveryItemRepository.create({
        deliveryId: delivery.id,
        shipmentId,
      });
      await this.deliveryItemRepository.save(createDeliveryItem);
    }
    return await this.updateDelivery(delivery.providerOrderId);
  }

  async updateDelivery(orderId: string) {
    const order = await this.makeRequest(
      { api_key: this.apiKey, order_id: orderId },
      'developer/order_status',
    );

    if (!order) {
      throw new BadRequestException('Order not found from delivery provider');
    }

    const status = order.order?.status || null;
    const amountQuoted = order.order?.amount_quoted || null;
    const amountPaid = order.order?.amount_paid || null;
    const distanceKm = order.order?.distance_km || null;
    const estimatedMinutes = order.order?.minutes || null;
    const driverName = order.driver?.name || null;
    const driverPhone = order.driver?.phone || null;
    const driverAvatar = order.driver?.avatar || null;
    const driverRating = order.driver?.rating || null;
    const driverMeta = order.driver?.meta || null;
    const driverEta = order.driver?.eta || null;

    // Extract waypoints (pickups and drop-offs)
    const waypoints =
      order.waypoints?.map((waypoint) => ({
        id: waypoint.id || null,
        type: waypoint.type || null,
        status: waypoint.status || null,
        address: waypoint.address || null,
        latitude: waypoint.latitude || null,
        longitude: waypoint.longitude || null,
        customerName: waypoint.customer?.name || null,
        customerPhone: waypoint.customer?.phone_number || null,
        customerEmail: waypoint.customer?.email || null,
        trackingUrl: waypoint.meta?.tracking_url || null,
        qrCodePayload: waypoint.meta?.qr_code_payload || null,
      })) || [];

    // Update the delivery entity
    await this.deliveryRepository.update(
      { providerOrderId: orderId },
      {
        status,
        amountQuoted,
        amountPaid,
        distanceKm,
        estimatedMinutes,
        driverName,
        driverPhone,
        driverAvatar,
        driverRating,
        driverMeta,
        driverEta,
        waypoints,
        payments: order.payment ?? null,
      },
    );

    return await this.deliveryRepository.findOne({
      where: {
        providerOrderId: orderId,
      },
      relations: ['items', 'items.shipment'],
    });
  }

  async pickupLocation() {
    const config = await this.appConfig.getConfig();
    if (
      !config.pickupAddress ||
      !config.pickupEmail ||
      !config.pickupName ||
      !config.pickupPhone
    ) {
      throw new BadRequestException(
        'Please ensure pickup location is configured',
      );
    }

    const { pickupAddress, pickupEmail, pickupName, pickupPhone } = config;

    return { pickupAddress, pickupEmail, pickupName, pickupPhone };
  }

  async findAll(filter: FindDeliveryDto, pageOptionsDto: PageOptionsDto) {
    const deliveries = this.deliveryRepository
      .createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.items', 'items')
      .leftJoinAndSelect('items.shipment', 'shipment')
      .leftJoinAndSelect('shipment.order', 'order')
      .andWhere(filter.status ? `delivery.status = :status` : '1=1', {
        status: filter.status,
      })
      .andWhere(filter.from ? `delivery.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `delivery.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .andWhere(
        filter.search
          ? new Brackets((qb) => {
              qb.where('delivery.reference like :reference', {
                reference: '%' + filter.search + '%',
              }).orWhere('order.reference like :reference', {
                reference: '%' + filter.search + '%',
              });
            })
          : '1=1',
      )
      .orderBy('delivery.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await deliveries.getCount();
    const { entities } = await deliveries.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async cancel(deliveryId: string) {
    const delivery = await this.deliveryRepository.findOneBy({
      id: deliveryId,
    });

    const payload = {
      api_key: this.apiKey,
      order_id: delivery.providerOrderId,
    };

    await this.makeRequest(payload, 'developer/order_cancel');
    await this.updateDelivery(delivery.providerOrderId);
  }
}
