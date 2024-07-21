import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	linkActiveClass: "active",
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("@/views/HomeView.vue"),
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/views/Auth/LoginView.vue"),
		},
		{
			path: "/register",
			name: "register",
			component: () => import("@/views/Auth/RegisterView.vue"),
		},
		{
			path: "/appointments",
			name: "appointments",
			component: () => import("@/views/User/AppointmentsView.vue"),
		},
		{
			path: "/admin",
			children: [
				{
					name: "services",
					path: "services",
					component: () => import("@/views/Admin/ServicesView.vue"),
				},
				{
					path: "employees",
					path: "workers",
					component: () => import("@/views/Admin/WorkersView.vue"),
				},
			],
		},
		{
			path: "/worker",
			children: [
				{
					name: "schedule",
					path: "schedule",
					component: () => import("@/views/Worker/ScheduleView.vue"),
				},
				{
					name: "services",
					path: "services",
					component: () => import("@/views/Admin/ServicesView.vue"),
				},
			],
		},
	],
});

router.beforeEach(async (to, from, next) => {
	const publicPages = ["/", "/login", "/register"];
	const auth = useAuthStore();
	const isPublicPage = publicPages.includes(to.path);
	const authRole = auth.authRole;
	const isAuthenticated = auth.authUser;

	to.name
		? (document.title = `Barbaro - ${to.name}`)
		: (document.title = "Barbaro");

	if (!isAuthenticated) {
		if (isPublicPage) {
			next();
		} else {
			auth.returnUrl = to.fullPath;
			next("/login");
		}
	} else {
		switch (authRole) {
			case "admin":
				next();
				break;
			case "worker":
				if (to.path.startsWith("/admin")) {
					next("/");
				} else {
					next();
				}
				break;
			default:
				if (to.path.startsWith("/admin") || to.path.startsWith("/worker")) {
					next("/");
				} else {
					next();
				}
		}
	}
});

export default router;
