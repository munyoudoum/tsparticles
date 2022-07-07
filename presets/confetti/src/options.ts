import type { ISourceOptions, RecursivePartial } from "tsparticles-engine";
import { ConfettiOptions } from "./ConfettiOptions";
import type { IConfettiOptions } from "./IConfettiOptions";

export const loadOptions = (confettiOptions: RecursivePartial<IConfettiOptions>): ISourceOptions => {
    const actualOptions = new ConfettiOptions();

    actualOptions.load(confettiOptions);

    return {
        fullScreen: {
            enable: true,
            zIndex: actualOptions.zIndex,
        },
        fpsLimit: 120,
        particles: {
            number: {
                value: 0,
            },
        },
        detectRetina: true,
        motion: {
            disable: actualOptions.disableForReducedMotion,
        },
        emitters: [],
    };
};
