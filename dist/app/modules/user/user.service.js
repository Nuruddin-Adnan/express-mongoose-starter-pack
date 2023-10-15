"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const searcher_1 = __importDefault(require("../../../shared/searcher"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const getAllUsers = (filters, queries) => __awaiter(void 0, void 0, void 0, function* () {
    const conditions = (0, searcher_1.default)(filters, user_constant_1.userSearchableFields);
    const { limit = 0, skip, fields, sort } = queries;
    const resultQuery = user_model_1.User.find(conditions)
        .skip(skip)
        .select(fields)
        .sort(sort)
        .limit(limit);
    const [result, total] = yield Promise.all([
        resultQuery.exec(),
        user_model_1.User.countDocuments(conditions),
    ]);
    const page = Math.ceil(total / limit);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.role && !user_constant_1.role.includes(payload.role)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid user role');
    }
    // destructure the {name} for dynamic update of nested value
    const { name } = payload, userData = __rest(payload, ["name"]);
    const updatedUserData = Object.assign({}, userData);
    // dynamically handling
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`; // `name.fisrtName`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatedUserData[nameKey] = name[key];
        });
    }
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, updatedUserData, {
        new: true,
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id);
    return result;
});
const getMyProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User Not found');
    }
    const result = yield user_model_1.User.findById(id);
    return result;
});
const updateMyProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User Not found');
    }
    // Check if the payload contains the role field and validate its value
    if (payload.role && !user_constant_1.role.includes(payload.role)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid user role');
    }
    // destructure the {name} for dynamic update of nested value
    const { name } = payload, userData = __rest(payload, ["name"]);
    const updatedUserData = Object.assign({}, userData);
    // dynamically handling
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`; // `name.fisrtName`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatedUserData[nameKey] = name[key];
        });
    }
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, updatedUserData, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.UserService = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
};
