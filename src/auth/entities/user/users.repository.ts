import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt"
import { SignUpCredentialsDto } from "../../dto/signup-credentials-dto";
import { ChangeProfileInfoDto } from "src/auth/dto/change-profile-info.dto";

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: SignUpCredentialsDto): Promise<User> {
    const { login, password, email, role } = authCredentialsDto
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = this.create({
        login,
        password: hashedPassword,
        email,
        role
    })

    return this.save(user)
  }

  async changeUserByLogin(
    login: string,
    changeProfileInfoDto: ChangeProfileInfoDto
  ): Promise<User> {
    const user = await this.findOneBy({login})
    if (!user) {
      return undefined
    }
    Object.assign(user, changeProfileInfoDto)
    return this.save(user)
  }

  async findUserByEmailOrLogin(loginOrEmail: string): Promise<User> {
    const query = this.createQueryBuilder('user')
    query.andWhere('(user.login = :loginOrEmail OR user.email = :loginOrEmail)', { loginOrEmail })
    const found = await query.getOne()
    return found
  }
}