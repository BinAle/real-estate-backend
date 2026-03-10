import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: unknown, executionContext: ExecutionContext) =>{
        const request = executionContext.switchToHttp().getRequest()
        return request.user
    },
);