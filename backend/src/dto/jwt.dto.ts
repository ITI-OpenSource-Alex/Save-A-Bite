export class JwtDto {
    userId!: string;
    role!: string;
    email!: string;
    iat?: number;
    exp?: number;
}
