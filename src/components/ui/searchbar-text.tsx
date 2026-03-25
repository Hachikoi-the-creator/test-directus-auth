"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { capitalizeWord } from "@/lib/text-parsers";
import { useRef, useState, type KeyboardEvent } from "react";

type Props = {
  placeholder: string;
  options: { value: string; label: string }[];
  setOptions: (options: { value: string; label: string }[]) => void;
  className?: string;
  disabled?: boolean;
  inputClassname?: string;
  topClassname?: string;
  innerInputClassname?: string;
};

export default function SearchBar({
  options,
  setOptions,
  placeholder,
  disabled,
  inputClassname,
  topClassname,
  innerInputClassname,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // spanish options so it's easier to add to URL

  const optionsRef = useRef<HTMLAnchorElement[] | HTMLButtonElement[]>([]);
  const [showresults, setShowresults] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const inputChangeHandler = (text: string) => {
    if (text === "") setUserSearch("");
    setUserSearch(text);
  };

  // Handle arrow key navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // provisional index, will always end up changing
    let newIndex = 777;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      newIndex = Math.max(0, selectedIndex - 1);
      setSelectedIndex(newIndex);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      newIndex = Math.min(options.length - 1, selectedIndex + 1);
      setSelectedIndex(newIndex);
    } else if (event.key === "Enter") {
      const optionValue = options[selectedIndex].value;
      setOptions(options.filter((option) => option.value === optionValue));
    }
    // reset index if user types, or moves to the left or anything, besides up and down btns
    else {
      setSelectedIndex(0);
    }

    if (optionsRef.current[newIndex]) {
      optionsRef.current[newIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const handleInputClick = () => {
    const searchDiv = document.getElementById("busqueda");

    if (searchDiv) {
      searchDiv.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Trick to make the page scroll when results appear in mobile*/}
      <div
        id="busqueda"
        className="absolute -top-20 bg-transparent w-6 h-1 z-10"
        tabIndex={-1}
      ></div>
      {/* trick end */}
      <div className="relative border-none z-20" id="FormAllStuff">
        <div
          className={cn(
            "FormContainer shadow-md bg-white flex py-2 items-center gap-3 rounded-full pl-3 relative pr-2",
            inputClassname
          )}
        >
          {/* hack to remove autofocus in input */}

          <span
            tabIndex={0}
            className="absolute top-0 text-transparent w-0 h-0 focus:outline-none"
            autoFocus
          >
            random text
          </span>
          <input
            type="text"
            placeholder="Estado, municipio, colonia ..."
            className={cn(
              "w-full flex-1 rounded-full h-12 border-primary-400 pl-9",
              innerInputClassname
            )}
            name="city"
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.currentTarget.value);
              if (e.currentTarget.value.length > 2)
                inputChangeHandler(e.currentTarget.value.trim());
              else setOptions([]);
            }}
            autoComplete="off"
            onClick={() => {
              // scroll to top when in mobile
              window.innerWidth < 1024 && handleInputClick();
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowresults(true)}
            onBlur={() => setTimeout(() => setShowresults(false), 300)}
            tabIndex={999}
          />
          {/* {hasIcon && (
            <span
              className="bg-primary-500 p-4 rounded-full hover:cursor-pointer"
              onClick={handleSearchClick}
            >
              <Search color="white" />
            </span>
          )} */}
        </div>

        <div className="absolute left-0 right-0 FormResultsContainer">
          {options.length && showresults ? (
            <div className="my-2 rounded-3xl bg-white p-3 shadow-md">
              <ScrollArea className="shadow-none w-full max-h-56 px-4 overflow-y-auto scrollbar-thumb-primary-500 scrollbar-thin scrollbar-track-gray-100 mt-1">
                {/* if it's in any other page, redirect, else add the new location */}
                {options.map((opt, index) => {
                  return (
                    <button
                      onClick={() =>
                        setOptions(
                          options.filter((option) => option.value === opt.value)
                        )
                      }
                      title={opt.label}
                      key={opt.value}
                      // @ts-expect-error
                      ref={(el) =>
                        (optionsRef.current[index] = el as HTMLButtonElement)
                      }
                      className={`text-sm w-full lg:text-base block p-2 transition-colors duration-150 ease-in-out hover:bg-primary-400 hover:text-white ${
                        index === options.length - 1 && "border-none"
                      } ${
                        selectedIndex === index && "bg-primary-400 text-white"
                      }`}
                    >
                      <p className="text-left">{capitalizeWord(opt.label)}</p>
                    </button>
                  );
                })}
              </ScrollArea>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
