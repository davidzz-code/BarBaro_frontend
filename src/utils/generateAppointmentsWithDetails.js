export default function generateAppointmentsWithDetails(
	appointments,
	services,
	workers,
	users,
) {
	const servicesMap = services.reduce((map, service) => {
		map[service.id] = service;
		return map;
	}, {});

	const workersMap = workers.reduce((map, worker) => {
		map[worker.id] = worker;
		return map;
	}, {});
	
	const usersMap = users.reduce((map, user) => {
		map[user.id] = user;
		return map;
	}, {});

	return appointments.map((appointment) => {
		const serviceDetails = appointment.relationships.services.data.map(
			(serviceRef) => servicesMap[serviceRef.id]
		);
		const workerDetails = workersMap[appointment.relationships.worker.data.id];
		const userDetails = usersMap[appointment.relationships.user.data.id];

		return {
			...appointment,
			serviceDetails,
			workerDetails,
			userDetails,
		};
	});
}
