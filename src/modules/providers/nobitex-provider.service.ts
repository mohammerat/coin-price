import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NobitexProviderService {
  private readonly logger: Logger;

  constructor(private readonly httpService: HttpService) {
    this.logger = new Logger('Providers/Nobitex');
  }

  async getData() {
    try {
      return (
        await firstValueFrom(
          this.httpService.post(
            'https://api.nobitex.ir/market/global-stats',
            {},
          ),
        )
      ).data;
    } catch (e) {
      this.logger.error(
        `Error happened in getting data from nobitex provider: ${e.response.status} ${e.response.data} ${e.response.headers}`,
      );
      throw new InternalServerErrorException(
        `Error in getting info: ${e.message}`,
      );
    }
  }
}
