import { createContribution, getCurrentlyOpenedWall, getWallById, paintWall } from "./wall";

export const api = {
    wall: (id = null) => {
        return {
            createContribution: (userId, content) => createContribution(id, userId, content),
            paint: () => paintWall(id),
            getWall: (wallId) => getWallById(wallId),
            getCurrentlyOpenedWall: () => getCurrentlyOpenedWall(),
        }
    }
}