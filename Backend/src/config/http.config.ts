const httpConfig=()=>({

    //Success Response 
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    //Client erro responses 
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    //Server Error Responses
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
})
export const HTTPSTATUS= httpConfig()
export type HttpStatusCodeType=(typeof HTTPSTATUS)[keyof typeof HTTPSTATUS]