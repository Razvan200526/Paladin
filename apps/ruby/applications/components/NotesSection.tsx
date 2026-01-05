import  { H6 } from '@common/components/typography'
import { Divider } from '@heroui/react'
import type { ApplicationType } from '@sdk/types'
import { Icon } from '@iconify/react'

export const NotesSection = ({application} :  {application: ApplicationType}) => {
  return (
    <div>
            {application.comments?.length > 0 && (
              <>
                <Divider />
                <div>
                  <H6 className="text-primary mb-3">Notes</H6>
                  <div className="space-y-2">
                    {application.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl bg-light border border-border"
                      >
                        <Icon
                          icon="heroicons:chat-bubble-left"
                          className="size-4 text-primary mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-secondary-text">{comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}</div>
  )
}

