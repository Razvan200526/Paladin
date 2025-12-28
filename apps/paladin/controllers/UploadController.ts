import { apiResponse } from '@paladin/client';
import type { ApiResponse } from '@paladin/sdk/types';
import { StorageService } from '@paladin/services';
import { controller, inject, post } from '@razvan11/paladin';
import type { Context } from 'hono';

@controller('/api/uploads/images')
export class UploadController {
  constructor(@inject(StorageService) private storageService: StorageService) {}

  @post('/avatars')
  async uploadAvatar(c: Context): Promise<ApiResponse<{ url: string } | null>> {
    try {
      const data = (await c.req.formData()) as FormData;
      const avatar = data.get('avatar') as File;
      if (!avatar) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'No avatar provided',
            isClientError: true,
          },
          400,
        );
      }
      const url = await this.storageService.uploadAvatar(avatar);
      return apiResponse(c, {
        data: { url },
        message: 'Avatar uploaded successfully',
      });
    } catch (e) {
      console.error(e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to upload',
          isServerError: true,
        },
        500,
      );
    }
  }
}
