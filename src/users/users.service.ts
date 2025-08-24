import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  hashPassword(plainPassword: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(plainPassword, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async isExistEmail(email: string) {
    return await this.userModel.exists({ email });
  }

  async register(registerUserDto: RegisterUserDto) {
    const hashPassword = this.hashPassword(registerUserDto.password);
    const emailExists = await this.isExistEmail(registerUserDto.email);

    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    let user = await this.userModel.create({
      ...registerUserDto,
      password: hashPassword,
      role: userRole?._id,
    });
    return user;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const hashPassword = this.hashPassword(createUserDto.password);
    const emailExists = await this.isExistEmail(createUserDto.email);

    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    let newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population } = aqp(qs);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    let { sort } = aqp(qs);
    if (!sort || Object.keys(sort).length === 0) {
      sort = { updatedAt: -1 }; // Use object format for MongoDB sort
    }

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid MongoDB ObjectId format');
    }
    let user = await this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
    return user;
  }

  findByUsername(username: string) {
    return this.userModel
      .findOne({ email: username })
      .populate({ path: 'role', select: { name: 1 } });
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid MongoDB ObjectId format');
    }
    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException(
        `Không thể xoá tài khoản ${foundUser.email}`,
      );
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    let deleteUser = await this.userModel.softDelete({ _id: id });
    return deleteUser;
  }

  updateRefreshToken = async (refreshToken: string, _id: string) => {
    await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      },
    );
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel
      .findOne({ refreshToken })
      .populate({ path: 'role', select: { name: 1 } });
  };
}
