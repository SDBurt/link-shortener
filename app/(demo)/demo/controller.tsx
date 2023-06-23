"use client"

import { useMemo, useState } from "react"
import { Link, Project } from "@prisma/client"

import { socialItemType, socialsOptions } from "@/config/marketing"
import THEME from "@/lib/constants/theme"
import { ThemeProps } from "@/lib/types"
import ProjectPreview from "@/components/shared/bio/project-preview"
import { BioSocialItem } from "@/components/shared/bio/socials/social-item"

import LeftContent from "./left-content"

export default function DemoEditor() {
  const [projectData, setProjectData] = useState<
    Pick<Project, "name" | "image" | "description">
  >({
    name: "",
    image: "",
    description: "",
  })

  const [socialsData, setSocialsData] = useState<{ [key: string]: string }>({
    facebook: "",
    twitter: "",
    instagram: "",
    github: "",
    linkedin: "",
    email: "",
    youtube: "",
    twitch: "",
    dribbble: "",
  })
  const [themeData, setThemeData] = useState<ThemeProps>(THEME)

  const [linkData, setLinkData] = useState<
    Pick<Link, "title" | "url" | "slug" | "key">[]
  >([])

  const socials: BioSocialItem[] = useMemo(() => {
    const userSocials = Object.keys(socialsData)
    const socials: BioSocialItem[] = []
    socialsOptions.forEach((option: socialItemType) => {
      if (userSocials.includes(option.name)) {
        socials.push({
          label: option.label,
          name: option.name,
          Icon: option.icon,
          url: socialsData[option.name],
        })
      }
    })
    return socials
  }, [socialsData])

  return (
    <div className="grid h-screen grid-cols-3 divide-x">
      <div className="col-span-2 h-screen">
        <LeftContent
          project={projectData}
          theme={themeData}
          links={linkData}
          socials={socialsData}
          setProject={setProjectData}
          setTheme={setThemeData}
          setLinks={setLinkData}
          setSocials={setSocialsData}
        />
      </div>

      <div className="col-span-1 flex h-screen w-full flex-col items-center justify-center">
        <ProjectPreview
          user={{
            username: projectData.name,
            imageUrl: projectData.image || "",
          }}
          socials={socials}
          project={projectData}
          theme={themeData}
          links={linkData}
        />
      </div>
    </div>
  )
}
