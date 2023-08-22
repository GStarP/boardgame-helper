import { atom, useAtom } from "jotai";
import { PluginDetail } from "./types";

export const j_ava_plugins = atom<PluginDetail[]>([])
export const j_ava_plugins_loading = atom(false)

// @TODO mock
export function useAvailablePlugins(): [PluginDetail[], boolean, () => Promise<void>] {
    const [availablePlugins, setAvailablePlugins] = useAtom(j_ava_plugins)
    const [availablePluginsLoading, setAvailablePluginsLoading] = useAtom(j_ava_plugins_loading)
    const updateAvailablePlugins = async () => {
        setAvailablePluginsLoading(true)
        setTimeout(() => {
            setAvailablePlugins([{
                pluginId: 'chwazi',
                pluginName: 'Chwazi',
                pluginIcon: '',
                pluginDesc: 'a random startup chosing plugin'
            }])
            setAvailablePluginsLoading(false)
        }, 2000)
    }
    return [availablePlugins, availablePluginsLoading, updateAvailablePlugins]
}