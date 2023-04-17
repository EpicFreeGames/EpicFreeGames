"use client";

import { Button } from "@/ui/Button";

export default function Page() {
	return (
		<form
			className="pt-[300px]"
			onSubmit={(e) => {
				e.preventDefault();
				alert("hi");
			}}
		>
			<input type="text" className="w-[300px] border border-black p-2" />
			<Button type="submit" onPress={() => alert("not submit")}>
				test
			</Button>
		</form>
	);
}
