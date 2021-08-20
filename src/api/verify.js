import request from '@/utils/request.js';

export function getCaptcha() {
    return request({
        url: '/res/captcha',
        method: 'get',
      })
}