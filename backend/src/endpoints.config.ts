import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
export default {
    BaseUrl: process.env.IP_ADDRESS ?? '',
    MongoUri: process.env.MONGODB_URI ?? '',
    Port: process.env.PORT ?? '',
    JWTSecret: process.env.JWT_SECRET ?? '',
    ResetTokenSecret: process.env.RESET_TOKEN_SECRET ?? '',
    emailUser: process.env.EMAIL_USER ?? '',
    emailPassword: process.env.EMAIL_PASS ?? '',
    emailService: process.env.EMAIL_SERVICE ?? '',
    FPassCooldown: process.env.FORGOT_PASSWORD_COOLDOWN ?? '',
    LoginCooldown: process.env.LOGIN_COOLDOWN ?? '',
}

