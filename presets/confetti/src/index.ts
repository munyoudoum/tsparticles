import type { Engine, RecursivePartial } from "tsparticles-engine";
import { ConfettiOptions as ConfettiClassOptions } from "./ConfettiOptions";
import type { EmitterContainer } from "tsparticles-plugin-emitters";
import type { IConfettiOptions } from "./IConfettiOptions";
import { loadAngleUpdater } from "tsparticles-updater-angle";
import { loadBaseMover } from "tsparticles-move-base";
import { loadCircleShape } from "tsparticles-shape-circle";
import { loadColorUpdater } from "tsparticles-updater-color";
import { loadEmittersPlugin } from "tsparticles-plugin-emitters";
import { loadLifeUpdater } from "tsparticles-updater-life";
import { loadOpacityUpdater } from "tsparticles-updater-opacity";
import { loadOptions } from "./options";
import { loadOutModesUpdater } from "tsparticles-updater-out-modes";
import { loadRollUpdater } from "tsparticles-updater-roll";
import { loadSizeUpdater } from "tsparticles-updater-size";
import { loadSquareShape } from "tsparticles-shape-square";
import { loadTiltUpdater } from "tsparticles-updater-tilt";
import { loadWobbleUpdater } from "tsparticles-updater-wobble";
import { tsParticles } from "tsparticles-engine";

async function loadPreset(
    engine: Engine,
    confettiOptions: RecursivePartial<IConfettiOptions>,
    override = false
): Promise<void> {
    await loadBaseMover(engine);
    await loadCircleShape(engine);
    await loadSquareShape(engine);
    await loadColorUpdater(engine);
    await loadSizeUpdater(engine);
    await loadOpacityUpdater(engine);
    await loadOutModesUpdater(engine);
    await loadEmittersPlugin(engine);
    await loadWobbleUpdater(engine);
    await loadRollUpdater(engine);
    await loadAngleUpdater(engine);
    await loadTiltUpdater(engine);
    await loadLifeUpdater(engine);

    await engine.addPreset("confetti", loadOptions(confettiOptions), override);
}

export async function loadConfettiPreset(main: Engine): Promise<void> {
    await loadPreset(main, {}, true);
}

export type ConfettiOptions = RecursivePartial<IConfettiOptions>;
export type ConfettiFirstParam = string | ConfettiOptions;

let container: EmitterContainer | undefined;

export async function confetti(
    idOrOptions: ConfettiFirstParam,
    confettiOptions?: RecursivePartial<IConfettiOptions>
): Promise<void> {
    let options: ConfettiOptions, id: string;

    if (container?.destroyed) {
        container = undefined;
    }

    if (typeof idOrOptions === "string") {
        id = idOrOptions;
        options = confettiOptions ?? {};
    } else {
        id = container?.id ?? `tsparticles_${Math.floor(Math.random() * 1000)}`;
        options = idOrOptions;
    }

    if (!container) {
        await loadPreset(tsParticles, options, true);

        container = (await tsParticles.load(id, { preset: "confetti" })) as EmitterContainer;
    }

    await addConfetti(container, options);
}

export const addConfetti = async (
    container: EmitterContainer | undefined,
    confettiOptions: ConfettiOptions
): Promise<void> => {
    if (!container) {
        await confetti(confettiOptions);

        return;
    }

    const actualOptions = new ConfettiClassOptions();

    actualOptions.load(confettiOptions);

    container?.addEmitter({
        startCount: actualOptions.count,
        position: actualOptions.position,
        size: {
            width: 0,
            height: 0,
        },
        rate: {
            delay: 0,
            quantity: 0,
        },
        life: {
            duration: 0.1,
            count: 1,
        },
        particles: {
            color: {
                value: actualOptions.colors,
            },
            shape: {
                type: actualOptions.shapes,
            },
            opacity: {
                value: { min: 0, max: 1 },
                animation: {
                    enable: true,
                    speed: 0.5,
                    startValue: "max",
                    destroy: "min",
                },
            },
            size: {
                value: 5 * actualOptions.scalar,
            },
            links: {
                enable: false,
            },
            life: {
                duration: {
                    sync: true,
                    value: actualOptions.ticks / 60,
                },
                count: 1,
            },
            move: {
                angle: {
                    value: actualOptions.spread,
                    offset: 0,
                },
                drift: {
                    min: -actualOptions.drift,
                    max: actualOptions.drift,
                },
                enable: true,
                gravity: {
                    enable: true,
                    acceleration: actualOptions.gravity * 9.81,
                },
                speed: actualOptions.startVelocity,
                decay: 1 - actualOptions.decay,
                direction: -actualOptions.angle,
                random: true,
                straight: false,
                outModes: {
                    default: "none",
                    bottom: "destroy",
                },
            },
            rotate: {
                value: {
                    min: 0,
                    max: 360,
                },
                direction: "random",
                animation: {
                    enable: true,
                    speed: 60,
                },
            },
            tilt: {
                direction: "random",
                enable: true,
                value: {
                    min: 0,
                    max: 360,
                },
                animation: {
                    enable: true,
                    speed: 60,
                },
            },
            roll: {
                darken: {
                    enable: true,
                    value: 25,
                },
                enable: true,
                speed: {
                    min: 15,
                    max: 25,
                },
            },
            wobble: {
                distance: 30,
                enable: true,
                speed: {
                    min: -15,
                    max: 15,
                },
            },
        },
    });
};
