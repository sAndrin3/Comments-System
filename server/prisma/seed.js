import { PrismaClient } from "@prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

async function seed() {
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()
    const matteo = await prisma.user.create({ data: { name: "Matteo" } })
    const vic = await prisma.user.create({ data: { name: "Vic" } })

    const post1 = await prisma.post.create({
        data: {
            body: "The Tour de France is always a reminder of how demanding and beautiful professional cycling can be, combining brutal mountain climbs, tactical team play, and moments of pure individual courage. Every stage tells its own story, whether it’s a daring solo breakaway, a perfectly timed sprint, or a leader defending the yellow jersey under immense pressure. Watching riders push through exhaustion, weather, and strategy makes the race more than just a competition—it becomes a test of resilience, discipline, and passion that keeps fans hooked from the first stage to the final ride into Paris.",
            title: "Post 1",
        },
    })
    const post2 = await prisma.post.create({
        data: {
            body: "This year’s Tour de France feels especially intense, with every stage reshaping the overall standings and leaving no room for complacency. The mix of unpredictable weather, aggressive racing, and constant attacks has forced the favorites to stay alert at all times, while the underdogs continue to seize their moments in the spotlight. What makes it so compelling is not just who wins, but how the race unfolds—through teamwork, sacrifice, and split-second decisions that can define an entire Tour.",
            title: "Post 2",
        },
    })

    const comment1 = await prisma.comment.create({
        data: {
            message: "I am a root comment",
            userId: matteo.id,
            postId: post1.id,
        },
    })

    const comment2 = await prisma.comment.create({
        data: {
            parentId: comment1.id,
            message: "I am a nested comment",
            userId: vic.id,
            postId: post1.id,
        },
    })

    const comment3 = await prisma.comment.create({
        data: {
            message: "I am another root comment",
            userId: vic.id,
            postId: post1.id,
        },
    })
}

seed()
