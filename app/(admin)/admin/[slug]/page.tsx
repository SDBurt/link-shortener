import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { User, Project } from "@prisma/client";

import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/shared/page-header";
import { LinkCreateButton } from "@/components/admin/link/link-create-button";
import { AppShell } from "@/components/admin/layouts/shell";
import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkList } from "@/components/admin/link/link-list";
import { Appearance } from "./appearance";
import { ThemeProps } from "@/lib/types";

const getProject = cache(async (userId: User["id"], slug: Project["slug"]) => {
  return await db.project.findFirst({
    where: {
      userId: userId,
      slug: slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      links: true,
      description: true,
      image: true,
      theme: true,
    },
  });
});

export const metadata = {
  title: "Project Details",
};

async function ProjectPage({ params }) {
  const slug = params.slug;

  if (!slug) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const project = await getProject(session.user.id, slug);

  if (!project) {
    notFound();
  }

  const links = project?.links;
  const theme = project?.theme as ThemeProps;

  return (
    <AppShell>
      {/* <Breadcrumb /> */}
      <AppHeader
        heading={project?.name || "Untitled Project"}
        text="Create and manage short links."
      >
        <LinkCreateButton
          className={cn(buttonVariants({ variant: "default" }), "mt-1")}
        />
      </AppHeader>
      <Tabs defaultValue="links" className="w-full">
        <TabsList>
          <TabsTrigger id="links" value="links">
            Links
          </TabsTrigger>
          <TabsTrigger id="appearance" value="appearance">
            Appearance
          </TabsTrigger>
          <TabsTrigger id="analytics" disabled value="analytics">
            Analytics
          </TabsTrigger>
          <TabsTrigger id="settings" disabled value="settings">
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="links">
          <LinkList links={links} />
        </TabsContent>
        <TabsContent value="appearance">
          <Appearance
            project={project}
            links={links}
            user={{
              name: user?.name || "",
              image: user?.image || "",
            }}
            theme={theme}
          />
        </TabsContent>
        <TabsContent value="analytics">
          <p>To be implemented</p>
        </TabsContent>
        <TabsContent value="settings">
          <p>To be implemented</p>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

export default ProjectPage;
