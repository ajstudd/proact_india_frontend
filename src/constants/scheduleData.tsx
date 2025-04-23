export const months = [
	{ label: 'January', value: 1 },
	{ label: 'February', value: 2 },
	{ label: 'March', value: 3 },
	{ label: 'April', value: 4 },
	{ label: 'May', value: 5 },
	{ label: 'June', value: 6 },
	{ label: 'July', value: 7 },
	{ label: 'August', value: 8 },
	{ label: 'September', value: 9 },
	{ label: 'October', value: 10 },
	{ label: 'November', value: 11 },
	{ label: 'December', value: 12 },
];

export const hours: { label: string; value: string }[] = [];
for (let i = 0; i < 24; i++) {
	const hour = {
		label: `${i.toString()} ${i <= 1 ? 'hour' : 'hours'}`,
		value: i.toString(),
	};
	hours.push(hour);
}

export const minutes: { label: string; value: string }[] = [];
for (let i = 0; i < 60; i++) {
	const minute = {
		label: `${i.toString()} ${i <= 1 ? 'minute' : 'minutes'}`,
		value: i.toString(),
	};
	minutes.push(minute);
}

export const getFutureDaysForMonthAndYear = (month: string, year: string) => {
	const daysInMonth = new Date(parseInt(year, 10), parseInt(month, 10), 0).getDate();
	const futureDays = [];
	for (let i = 1; i <= daysInMonth; i++) {
		const day = {
			label: i.toString(),
			value: i.toString(),
		};
		futureDays.push(day);
	}

	const remainingDays = futureDays.filter((day) => {
		const date = new Date(`${month}/${day.value}/${year}`);
		return date.getTime() >= Date.now();
	});
	return remainingDays;
};

export const getFutureMonths = (year: string) => {
	const futureMonths = [];
	// if year is current year then get months from current month else get all months
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	const startMonth = currentYear === parseInt(year, 10) ? currentMonth : 1;
	for (let i = startMonth; i <= 12; i++) {
		const month = {
			label: months[i - 1].label,
			value: i.toString(),
		};
		futureMonths.push(month);
	}
	return futureMonths;
};

export const getFutureYears = () => {
	const futureYears = [];
	const currentYear = new Date().getFullYear();
	for (let i = currentYear; i <= currentYear + 20; i++) {
		const year = {
			label: i.toString(),
			value: i.toString(),
		};
		futureYears.push(year);
	}
	return futureYears;
};

export const scheduleDays = [
	{ label: '1 day', value: 1 },
	{ label: '2 days', value: 2 },
	{ label: '3 days', value: 3 },
	{ label: '4 days', value: 4 },
	{ label: '5 days', value: 5 },
	{ label: '6 days', value: 6 },
	{ label: '7 days', value: 7 },
];

export const chatOrderBy = [
	{ label: 'most_recent', value: 'time' },
	{ label: 'most_deso', value: 'deso' },
	{ label: 'most_followed', value: 'followers' },
	{ label: 'largest_holder', value: 'holders' },
];

export const languagesData = [
	{ label: 'English', value: 'en' },
	{ label: 'Netherlandis', value: 'nl' },
	{ label: 'Francais', value: 'fr' },
	{ label: 'Hindi', value: 'hin' }
];
