import fs from "fs/promises";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

class UserManager {
    constructor(path = "./db/users.json") {
        this.path = path;
    }

    async initialize() {
        try {
            await fs.readFile(this.path, "utf-8");
        } catch (error) {
            console.log("Base de datos de usuarios no encontrada. Creando...");
            await this.createDefaultDB();
        }
    }

    async createDefaultDB() {
        try {
            await fs.writeFile(this.path, JSON.stringify([], null, 2));
            console.log("Base de datos de usuarios creada exitosamente.");
        } catch (error) {
            console.log("Error al crear la base de datos de usuarios: ", error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const { first_name, last_name, email, age, password } = userData;
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                id: randomUUID(),
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                cart: null, // ACA VA EL cart ID
                role: "user",
            };

            const users = await this.#getUsers();
            users.push(newUser);

            await fs.writeFile(this.path, JSON.stringify(users, null, 2));

            return newUser;
        } catch (error) {
            console.log("Error al crear el usuario: ", error);
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    }

    async #getUsers() {
        try {
            const users = await fs.readFile(this.path, "utf-8");
            return JSON.parse(users);
        } catch (error) {
            console.log("getUsers error: ", error.code);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const users = await this.#getUsers();
            const user = users.find((user) => user.email === email);
            if (!user) {
                throw new Error(`Usuario con email ${email} no encontrado`);
            }

            console.log("Usuario encontrado: ", user);
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    }
}

const userManager = new UserManager();
await userManager.initialize();

export default userManager;
