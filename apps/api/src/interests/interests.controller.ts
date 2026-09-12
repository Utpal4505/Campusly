import { Controller, Get } from '@nestjs/common';
import { InterestsService } from './interests.service.js';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  /**
   * GET /interests — list all available campus interests for onboarding/discovery
   */
  @Get()
  async getInterests() {
    return this.interestsService.findAll();
  }
}
