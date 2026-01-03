// export const spotifyService = {
//     playSong: async (deviceId: string, trackId: string) => {
//         return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 uris: [`spotify:track:${trackId}`],
//                 position_ms: 0
//             }),
//         });
//     }
// }