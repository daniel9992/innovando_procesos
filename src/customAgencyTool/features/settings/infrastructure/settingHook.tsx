import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { isEmptyObject } from '@src/customAgencyTool/utils/objects/isEmptyObj';
import { useEffect } from 'react';
import type { InterfaceCategoryOnSave } from '../../calendar/domain/calendarEvent.entity';
import type { InterfaceConfigGeneralOnSave } from '../domain/modelCompany';
import type { InterfaceConfigListOfDocsSave } from '../domain/modelConfigDocList';
import type { InterfaceSelectedRateOnSave } from '../domain/modelListOfRates';
import {
    readSetting,
    selectError,
    selectSetting,
    selectStatus
} from './settingSlice';

// Definir un tipo para mapear IDs a sus tipos de retorno
type SettingTypeMap = {
    'data-id-configListOfRates': InterfaceSelectedRateOnSave;
    'data-id-configListOfDocs': InterfaceConfigListOfDocsSave;
    'data-id-configGeneral': InterfaceConfigGeneralOnSave;
    'data-id-categories-calendar': InterfaceCategoryOnSave;
};

export type SettingId = keyof SettingTypeMap;

/**
 *  useSettingHook
 *  Hook to get the settings from the collection
 *  It returns the settings, the status and the error
 *  @returns {Promise<SettingTypeMap[T]>}
 *  @example
 *  const { isLoading, getSetting } = useSettingHook();
 *  const result = await getSetting('data-id-categories-calendar'); *
 *
 */
export const useSettingHook = () => {
    const dispatch = useAppDispatch();
    const setting = useAppSelector(selectSetting);
    const status = useAppSelector(selectStatus);
    const error = useAppSelector(selectError);

    const getSetting = async <T extends SettingId>(
        settingId: T
    ): Promise<SettingTypeMap[T]> => {
        try {
            const result = await dispatch(readSetting({ id: settingId }));
            const payload = result.payload;

            if (!payload || isEmptyObject(payload)) {
                throw new Error('No se pudo leer el valor del setting');
            }

            return payload as SettingTypeMap[T];
        } catch (error) {
            throw new Error(
                `Error al obtener el setting ${settingId}: ${error}`
            );
        }
    };

    return {
        isLoading: status === ReduxStatus.LOADING,
        error,
        setting,
        getSetting
    } as const;
};

export const useSetting = <T extends SettingId>(settingId: T) => {
    // Obtenemos el dispatch y los estados globales del slice
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectStatus);
    const error = useAppSelector(selectError);

    // Selector para obtener los datos específicos del setting.
    // Accedemos al valor dentro del objeto 'setting' del estado.
    const settingData = useAppSelector(selectSetting);

    // Utilizamos useEffect para despachar la acción de lectura
    // const onlyOnce = useRef(true);
    useEffect(() => {
        if (!settingId) {
            return;
        }

        // if (onlyOnce.current) {
        //     onlyOnce.current = false;
        //     return;
        // }
        // Se despacha la acción `readSetting` solo si el estado no es 'LOADING'
        // y los datos no han sido cargados todavía para evitar peticiones innecesarias.

        dispatch(readSetting({ id: settingId }));
    }, [dispatch, settingId]);

    // Retornamos un objeto con el estado de manera declarativa.
    return {
        data: settingData as SettingTypeMap[T] | undefined,
        isLoading: status === ReduxStatus.LOADING,
        error
    };
};
