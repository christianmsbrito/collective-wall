const apiBaseUrl = 'http://localhost:3000/api/v1/wall';

export async function createContribution(wallId, userId, content) {
    try {
        const response = await fetch(`${apiBaseUrl}/${wallId}/contributions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contribution: {
                    content,
                    user_id: userId,
                },
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create contribution');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function paintWall(wallId) {
    try {
        const response = await fetch(`${apiBaseUrl}/${wallId}/close`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to paint wall');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}