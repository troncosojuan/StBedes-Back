import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SurveyStateService {
    constructor(private readonly prismaService: PrismaService) { }

    async get() {
        return this.prismaService.survey_state.findMany();
    }

    async set(payload) {
        payload = payload.data;
        return this.prismaService.survey_state.update({
            where: {
                id: payload.id
            },
            data: {
                state: payload.state
            }
        });
    }
}
