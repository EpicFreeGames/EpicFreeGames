import { useSearchParams } from "react-router-dom";
import { RouterOutputs, trpc } from "../../trpc";
import { Input } from "../../ui/input";
import { startTransition, useState } from "react";

export function AppSupportPage() {
	const [params, setParams] = useSearchParams();
	const id = params.get("id");

	const q = trpc.support.search.useQuery({ id: id! }, { enabled: !!id });

	return (
		<div className="mt-4">
			<Input
				placeholder="search..."
				onChange={(t) => {
					startTransition(() => {
						setParams(new URLSearchParams({ id: t.target.value }));
					});
				}}
			/>

			{!!q.data?.length && (
				<ul className="space-y-4 mt-4">
					{q.data.map((s) => (
						<Server key={s.discordId} server={s} />
					))}
				</ul>
			)}
		</div>
	);
}

function Server(props: { server: RouterOutputs["support"]["search"][number] }) {
	const s = props.server;

	const [isCommandsOpen, setIsCommandsOpen] = useState(false);
	const [isSendLogsOpen, setIsSendLogsOpen] = useState(false);

	return (
		<li className="border border-gray-700 p-2">
			<h2 className="mb-2">{s.discordId}</h2>

			<div className="flex flex-col gap-4 sm:flex-row">
				<dl className="space-y-2">
					<div>
						<dt className="leading-none">channel:</dt>
						{s.channelId ? (
							<>
								<dd>{s.channelId}</dd>
								{s.channelUpdatedAt && (
									<dd className="leading-none">
										<Time stamp={s.channelUpdatedAt} />
									</dd>
								)}
							</>
						) : (
							<dd>not set</dd>
						)}
					</div>

					<div>
						<dt className="leading-none">webhookId</dt>
						<dd>{s.webhookId ? s.webhookId : "not set"}</dd>
					</div>

					<div>
						<dt className="leading-none">threadId:</dt>
						<dd>{s.threadId ? s.threadId : "not set"}</dd>
					</div>

					<div>
						<dt className="leading-none">roleId:</dt>
						<dd>{s.roleId ? s.roleId : "not set"}</dd>
					</div>

					<div>
						<dt className="leading-none">createdAt:</dt>
						<dd>{s.createdAt ? <Time stamp={s.createdAt} /> : "not set"}</dd>
					</div>

					<div>
						<dt className="leading-none">lang:</dt>
						<dd>{s.languageCode ? s.languageCode : "not set"}</dd>
					</div>
					<div>
						<dt className="leading-none">currency:</dt>
						<dd>{s.currencyCode ? s.currencyCode : "not set"}</dd>
					</div>
				</dl>

				<div>
					<p onClick={() => setIsSendLogsOpen((prev) => !prev)}>sendlogs:</p>

					{isSendLogsOpen &&
						(!s.sendLogs.length ? (
							"no send logs"
						) : (
							<ul className="space-y-4">
								{s.sendLogs.map((l) => (
									<li>
										<p>
											<Time stamp={l.createdAt} />
										</p>
										<dl>
											<div>
												<dt className="leading-none">games:</dt>
												<dd>
													{l.send.games
														.map((g) => g.displayName)
														.join(", ")}
												</dd>
											</div>

											<div>
												<dt className="leading-none">type:</dt>
												<dd>{l.type}</dd>
											</div>

											<div>
												<dt className="leading-none">result:</dt>
												<dd>{l.result}</dd>
											</div>

											<div>
												<dt className="leading-none">success:</dt>
												<dd>{l.success ? "true" : "false"}</dd>
											</div>

											<div>
												<dt className="leading-none">code:</dt>
												<dd>{l.statusCode}</dd>
											</div>
										</dl>
									</li>
								))}
							</ul>
						))}
				</div>

				<div>
					<p onClick={() => setIsCommandsOpen((prev) => !prev)}>commands:</p>
					{isCommandsOpen && <Commands discordServerId={s.discordId} />}
				</div>
			</div>
		</li>
	);
}

function Commands(props: { discordServerId: string }) {
	const q = trpc.support.commands.useQuery({ discordServerId: props.discordServerId });

	if (q.isLoading) return <p>loading...</p>;
	if (q.isError) return <p>error</p>;

	return (
		<div>
			<button
				onClick={() => {
					q.refetch();
				}}
			>
				{q.isFetching ? "refreshing" : "refresh"}
			</button>

			{!q.data?.length ? (
				<p>no commands</p>
			) : (
				<ul className="space-y-4">
					{q.data.map((c) => (
						<li>
							<p>{c.senderId}</p>
							<p>
								<Time stamp={c.createdAt} />
							</p>
							<p>{c.command}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function Time({ stamp }: { stamp: Date }) {
	const [showCopied, setShowCopied] = useState(false);

	async function copy() {
		const discordRelativeTs = `<t:${stamp.getTime()}:f>`;
		await navigator.clipboard.writeText(discordRelativeTs);

		setShowCopied(true);
		const t = setTimeout(() => {
			setShowCopied(false);
		}, 1000);

		return () => {
			clearTimeout(t);
		};
	}

	return <span onClick={copy}>{showCopied ? "copied" : stamp.toISOString()}</span>;
}
