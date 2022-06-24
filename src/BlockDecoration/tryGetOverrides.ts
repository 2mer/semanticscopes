export default function tryGetOverrides<T extends {}>(overridesStr: string): T {
	try {
		const overrides = JSON.parse(overridesStr);

		return overrides;
	} catch (err) {
		return {} as T;
	}
}
