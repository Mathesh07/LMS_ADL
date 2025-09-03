import { Router } from "express";

const auth_router = Router()

auth_router.route("/register").post()
auth_router.route("/login").post()
auth_router.route("/logout").post()


auth_router.route("/verfication_code").post()
auth_router.route("/verify-email").post()

auth_router.route("/forgot-password").post()
auth_router.route("/reset-password").post()

auth_router.route("/oauth/:provider").post()
auth_router.route("/oauth/:provider/callback").post()

