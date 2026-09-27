import UserModel from "../../DB/models/user.model.js";

import DBService from "../../DB/db.service.js";

import { hashPassword, comparePassword } from "../../common/security/hash.js";

const usersDB = new DBService(UserModel);

async function signup({ name, email, password, phone, age }) {
  const existingUser = await usersDB.findOne({ email });

  if (existingUser) {
    return {
      status: 400,
      body: { message: "Email already exists." },
    };
  }

  const hashedPassword = await hashPassword(password);

  await usersDB.create({
    name,
    email,
    password: hashedPassword,
    phone,
    age,
  });

  return {
    status: 201,
    body: { message: "User added successfully." },
  };
}

async function login({ email, password }) {
  const user = await usersDB.findOne({ email });

  if (!user) {
    return {
      status: 400,
      body: { message: "Invalid email or password" },
    };
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return {
      status: 400,
      body: { message: "Invalid email or password" },
    };
  }

  return {
    status: 200,
    body: {
      message: "Login successful",
      userId: user._id,
    },
  };
}

async function updateUser(id, updateData) {
  const user = await usersDB.findById(id);

  if (!user) {
    return {
      status: 404,
      body: { message: "User not found" },
    };
  }

  // password cannot be updated through this endpoint
  delete updateData.password;

  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await usersDB.findOne({
      email: updateData.email,
    });

    if (existingUser) {
      return {
        status: 400,
        body: { message: "Email already exists." },
      };
    }
  }

  await usersDB.updateOne({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });

  return {
    status: 200,
    body: { message: "User updated" },
  };
}

async function deleteUser(id) {
  const deleted = await usersDB.deleteOne({ _id: id });

  if (!deleted) {
    return {
      status: 404,
      body: { message: "User not found" },
    };
  }

  return {
    status: 200,
    body: { message: "User deleted" },
  };
}

async function getUserById(id) {
  const user = await usersDB.findById(id);

  if (!user) {
    return {
      status: 404,
      body: { message: "User not found" },
    };
  }

  return {
    status: 200,
    body: user,
  };
}

export { signup, login, updateUser, deleteUser, getUserById };
