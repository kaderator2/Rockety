// models/replayFile.ts
export interface ReplayFile {
    id: string;
    path: string;
    originalname: string;
    processed: boolean;
    data?: ReplayData;
}

export interface ReplayData {
    file: string;
    replay: {
        header_size: number;
        header_crc: number;
        major_version: number;
        minor_version: number;
        net_version: number;
        game_type: string;
        properties: {
            TeamSize: number;
            UnfairTeamSize: number;
            Team0Score: number;
            Team1Score: number;
            Goals: {
                PlayerName: string;
                frame: number;
                PlayerTeam: number;
            }[];
            HighLights: {
                GoalActorName: string;
                CarName: string;
                BallName: string;
                frame: number;
            }[];
            PlayerStats: {
                bBot: boolean;
                Assists: number;
                Goals: number;
                OnlineID: string;
                Score: number;
                Shots: number;
                Team: number;
                Name: string;
                Saves: number;
                Platform: {
                    kind: string;
                    value: string;
                };
            }[];
            ReplayName: string;
            ReplayVersion: number;
            ReplayLastSaveVersion: number;
            GameVersion: number;
            BuildID: number;
            Changelist: number;
            BuildVersion: string;
            ReserveMegabytes: number;
            RecordFPS: number;
            KeyframeDelay: number;
            MaxChannels: number;
            MaxReplaySizeMB: number;
            Id: string;
            MapName: string;
            Date: string;
            NumFrames: number;
            MatchType: string;
            PlayerName: string;
        };
        content_size: number;
        content_crc: number;
        network_frames: null;
        levels: string[];
        keyframes: {
            time: number;
            frame: number;
            position: number;
        }[];
        debug_info: [];
        tick_marks: {
            description: string;
            frame: number;
        }[];
        packages: string[];
        objects: string[];
        names: string[];
        class_indices: {
            class: string;
            index: number;
        }[];
        net_cache: {
            object_ind: number;
            parent_id: number;
            cache_id: number;
            properties: {
                object_ind: number;
                stream_id: number;
            }[];
        }[];
    };
}

