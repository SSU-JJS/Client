import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

interface AuthShellProps {
	badge: string;
	title: string;
	description: string;
	children: ReactNode;
}

export function AuthShell({
	badge,
	title,
	description,
	children,
}: AuthShellProps) {
	return (
		<div className="flex min-h-screen flex-col bg-secondary/20">
			<SiteHeader />

			<main className="flex-1 py-10 md:py-16">
				<Container className="flex justify-center">
					<div className="flex w-full max-w-xl flex-col gap-6">
						<div className="flex flex-col items-center gap-4 text-center">
							<Badge variant="neutral">{badge}</Badge>
							<div className="flex flex-col gap-3">
								<h1 className="font-display text-4xl leading-tight text-brand-ink md:text-[2.8rem]">
									{title}
								</h1>
								<p className="text-base leading-7 text-muted-foreground">
									{description}
								</p>
							</div>
						</div>

						<Card className="border-border/70 bg-white shadow-soft">
							<CardContent className="p-6 md:p-8">{children}</CardContent>
						</Card>
					</div>
				</Container>
			</main>

			<SiteFooter />
		</div>
	);
}
