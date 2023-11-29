/* eslint-disable @typescript-eslint/no-explicit-any */
export default function generatePipeline(
  initialPipeline: any[],
  conditions?: any,
  skip?: number,
  fields?: string,
  sort?: string,
  limit?: number,
  ...others: any
) {
  const pipeline = initialPipeline;

  if (conditions) {
    pipeline.push({ $match: conditions });
  }

  if (skip! > 0) {
    pipeline.push({ $skip: skip as number });
  }

  if (fields) {
    const inputArray: string[] = fields.split(' ');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultObject = inputArray.reduce((acc: any, item) => {
      // Remove the leading '-' from the property name
      const propertyName = item.replace(/^-/, '');

      // Set the property value based on whether it starts with '-'
      const propertyValue = item.startsWith('-') ? 0 : 1;

      // If property value is 1, convert it to a number
      acc[propertyName] = propertyValue;

      return acc;
    }, {});

    pipeline.push({ $project: resultObject });
  }

  if (sort) {
    const inputArray: string[] = sort.split(' ');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultObject = inputArray.reduce((acc: any, item) => {
      // Remove the leading '-' from the property name
      const propertyName = item.replace(/^-/, '');

      // Set the property value based on whether it starts with '-'
      const propertyValue = item.startsWith('-') ? -1 : 1;

      // If property value is 1, convert it to a number
      acc[propertyName] = propertyValue;

      return acc;
    }, {});

    pipeline.push({ $sort: resultObject });
  }

  if (limit! > 0) {
    pipeline.push({ $limit: limit as number });
  }

  if (others) {
    pipeline.push(...others);
  }

  return pipeline;
}
