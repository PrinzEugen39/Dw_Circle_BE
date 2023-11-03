import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import cloudinary from "../libs/cloudinary";
import { Threads } from "../entities/Thread";
import { EventEmitter } from "stream";

export default new (class ThreadWorker {
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);
  private emitter = new EventEmitter();

  async create(queueName: string, connection: any) {
    try {
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName);
      await channel.consume(queueName, async (message) => {
        try {
          if (message !== null) {
            const payload = JSON.parse(message.content.toString());

            const cloudinaryResponse = payload.image
              ? await cloudinary.destination(payload.image)
              : null;

            const thread = this.ThreadRepository.create({
              content: payload.content,
              image: cloudinaryResponse,
              user_id: {
                id: payload.user_id,
              },
            });

            const threadResponse = await this.ThreadRepository.save(thread);

            this.emitter.emit("message");
            console.log(`(Worker) : Thread is created`, threadResponse);

            channel.ack(message);
          }
        } catch (error) {
          console.log(`(Worker) is failed : ${error}`);
        }
      });
    } catch (error) {
      console.log(`(Worker) error consume queue from thread : ${error}`);
    }
  }
})();
