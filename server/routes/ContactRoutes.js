import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleWare.js";
import {
 getContactsForDmList,
  searchContacts,
} from "../controllers/ContactController.js";
const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contact-for-dm", verifyToken, getContactsForDmList);

export default contactsRoutes;
