"use client"

import * as React from "react"
import NextLink from 'next/link'
import { useParams, useSelectedLayoutSegment } from "next/navigation"
import { Project, Link } from "@prisma/client"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { MobileNav } from "@/components/admin/nav/mobile-nav"
import { Icons } from "@/components/shared/icons"

import { ProjectDropdownNav } from "./project-drodown-nav"
import { LinkDropdownNav } from "./link-dropdown-nav"

type ProjectProps = Pick<Project, "name" | "slug"> & { links: Pick<Link, "title" | "slug" | "key">[] }

interface MainNavProps {
  showSiteName?: boolean
  items?: MainNavItem[]
  projects?: ProjectProps[]
  children?: React.ReactNode
}

export function MainNav({
  items,
  projects,
  showSiteName = false,
  children,
}: MainNavProps) {
  const segment = useSelectedLayoutSegment()

  const params = useParams()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  const currentProject = projects?.find((p) => p.slug === params?.slug)
  const currentLink = currentProject?.links?.find((p) => p.key === params?.key)
  
  return (
    <div className="flex gap-4 md:gap-8">
      <NextLink href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo />
        {showSiteName && (
          <span className="hidden font-bold sm:inline-block">
            {siteConfig.name}
          </span>
        )}
      </NextLink>
      <span className="flex justify-center items-center text-muted-foreground/60 text-xl">/</span>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <NextLink
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-center text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm",
                item.href.startsWith(`/${segment}`) && "text-foreground",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </NextLink>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
      <span className="flex justify-center items-center text-muted-foreground/60 text-xl">/</span>
      <div>
        {projects && <ProjectDropdownNav currentProject={currentProject} projects={projects ? projects : []} />}
      </div>
      <span className="flex justify-center items-center text-muted-foreground/60 text-xl">/</span>
      <div>
        {currentProject?.links && <LinkDropdownNav currentLink={currentLink} links={currentProject?.links ? currentProject.links : []} />}
      </div>
    </div>
  )
}
