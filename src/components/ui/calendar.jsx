import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Custom dropdown used inside the calendar's month/year selectors
function CalendarDropdown({ value, onChange, options = [], className, disabled, ...props }) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef(null)
  const listRef = React.useRef(null)
  const selected = options.find((option) => String(option.value) === String(value))

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  React.useEffect(() => {
    if (open) {
      listRef.current
        ?.querySelector('[data-selected="true"]')
        ?.scrollIntoView({ block: "center" })
    }
  }, [open, value])

  const handleSelect = (optionValue) => {
    onChange?.({ target: { value: String(optionValue) } })
    setOpen(false)
  }

  const step = (direction) => {
    const enabledOptions = options.filter((option) => !option.disabled)
    const currentIndex = enabledOptions.findIndex((option) => String(option.value) === String(value))
    const nextIndex = currentIndex + direction
    if (nextIndex < 0 || nextIndex >= enabledOptions.length) return
    onChange?.({ target: { value: String(enabledOptions[nextIndex].value) } })
  }

  return (
    <span ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={props["aria-label"]}
        disabled={disabled}
        onClick={(e) => {
          e.currentTarget.focus()
          setOpen((o) => !o)
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false)
          if (e.key === "ArrowDown") {
            e.preventDefault()
            step(1)
          }
          if (e.key === "ArrowUp") {
            e.preventDefault()
            step(-1)
          }
        }}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
          className
        )}
      >
        {selected?.label}
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>
      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 max-h-60 min-w-[7rem] overflow-y-auto rounded-md border border-input bg-popover p-1 text-popover-foreground shadow-md"
        >
          {options.map((option) => {
            const isSelected = String(option.value) === String(value)
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-selected={isSelected}
                disabled={option.disabled}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "block w-full rounded-sm px-2 py-1 text-left text-sm hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </span>
  )
}

// Calendar UI primitive (react-day-picker wrapper)
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  startMonth = new Date(2025, 0, 1),
  endMonth = new Date(new Date().getFullYear() + 10, 11, 31),
  ...props
}) {
  return (
    (<DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      className={cn("p-5", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4 relative",
        month: "flex flex-col gap-5",
        month_caption: "flex justify-center pt-1 relative items-center w-full px-10",
        caption_label: "text-base font-medium inline-flex items-center gap-1",
        dropdowns: "flex items-center gap-2 justify-center",
        nav: "flex items-center gap-1 absolute inset-x-0 top-0 justify-between z-10 pointer-events-none",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 pointer-events-auto"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 pointer-events-auto"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-11 font-normal text-sm",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-base focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].outside)]:bg-accent/50 [&:has([aria-selected].range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.range-end)]:rounded-r-md [&:has(>.range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-11 w-11 p-0 font-normal aria-selected:opacity-100"
        ),
        range_start: "range-start",
        range_end: "range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...iconProps }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("h-4 w-4", className)} {...iconProps} />
          }
          if (orientation === "down") {
            return <ChevronDown className={cn("h-4 w-4", className)} {...iconProps} />
          }
          return <ChevronRight className={cn("h-4 w-4", className)} {...iconProps} />
        },
        Dropdown: CalendarDropdown,
      }}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
