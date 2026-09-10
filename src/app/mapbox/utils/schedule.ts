export interface ScheduleStatus {
    label: string;
    isOpenNow?: boolean;
}

/**
 * Interpreta el campo "Horario" tal y como lo da la API del Gobierno. Cubre
 * los formatos más comunes del dataset ("L-D: 24H" y "L-D: HH:MM-HH:MM", el
 * mismo horario todos los días). Si el formato es más complejo (turnos
 * distintos por día, etc.) se devuelve el texto tal cual, sin intentar
 * calcular si está abierta ahora mismo — mejor no dar un dato erróneo.
 */
export function describeSchedule(horario: string | undefined, now: Date = new Date()): ScheduleStatus {
    if(!horario){
        return { label: 'Horario no disponible' };
    }

    if(/24\s*H/i.test(horario)){
        return { label: 'Abierta 24h', isOpenNow: true };
    }

    const match = horario.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if(!match){
        return { label: horario };
    }

    const [, startH, startM, endH, endM] = match;
    const startMinutes = Number(startH) * 60 + Number(startM);
    const endMinutes = Number(endH) * 60 + Number(endM);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const isOpenNow = startMinutes <= endMinutes
        ? nowMinutes >= startMinutes && nowMinutes < endMinutes
        : nowMinutes >= startMinutes || nowMinutes < endMinutes; // horario que cruza medianoche

    return {
        label: `${ isOpenNow ? 'Abierta ahora' : 'Cerrada ahora' } (${ horario })`,
        isOpenNow
    };
}
