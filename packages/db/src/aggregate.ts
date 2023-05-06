// parameter: (is one row of the result)
// {
//     <one>: <value>,
//     <many>: <many_value>,
// }[]

// result:
// {
//     <one>: <one_value>,
//     <many>: <many_value>[],
// }
// infer one and many from the parameter object
function aggregateOneToManyResult(parameter: any[]) {
	const one = Object.keys(parameter[0])![0]!;
	const many = Object.keys(parameter[0])![1]!;
	const result = {} as any;
	parameter.forEach((row) => {
		const oneValue = row[one];
		const manyValue = row[many];
		if (!result[oneValue]) {
			result[oneValue] = {
				[one]: oneValue,
				[many]: [],
			};
		}
		result[oneValue][many].push(manyValue);
	});
	return Object.values(result);
}

// do a typed version of the above function
function aggregateOneToManyResultTyped<One, Many>(
	parameter: { [key in keyof One | keyof Many]: any }[]
): { [key in keyof One]: One[key] }[] {
	const one = Object.keys(parameter[0]!)![0]! as keyof One;
	const many = Object.keys(parameter[0]!)![1]! as keyof Many;
	const result = {} as any;
	parameter.forEach((row) => {
		const oneValue = row[one];
		const manyValue = row[many];
		if (!result[oneValue]) {
			result[oneValue] = {
				[one]: oneValue,
				[many]: [],
			};
		}
		result[oneValue][many].push(manyValue);
	});
	return Object.values(result);
}
