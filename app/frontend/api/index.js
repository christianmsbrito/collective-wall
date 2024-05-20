import { createContribution } from "./wall";

export const api = {
    wall: (id = null) => {
        return {
            createContribution: (userId, content) => createContribution(id, userId, content),
        }
    }
}