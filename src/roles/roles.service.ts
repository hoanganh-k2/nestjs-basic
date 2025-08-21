import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const nameExist = await this.roleModel.findOne({ name });
    if (nameExist) {
      throw new BadRequestException('Name already exists');
    }

    let role = await this.roleModel.create({
      name,
      description,
      isActive,
      permissions,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      data: {
        _id: role?._id,
        createdAt: role?.createdAt,
      },
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.limit;

    if (sort) {
      // @ts-ignore: Unreachable code error
      sort = '-updatedAt';
    }

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
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
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    return (await this.roleModel.findOne({ _id: id })).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1 },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    const { name, description, isActive, permissions } = updateRoleDto;
    return await this.roleModel.updateOne(
      { _id: id },
      {
        name,
        description,
        isActive,
        permissions,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }
    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.roleModel.softDelete({ _id: id });
  }
}
