import {BlocksRenderer} from "@strapi/blocks-react-renderer";

interface RichTextProps {
  id: string;
  title: string;
  description: any[];
}

export default function RichText({data}: { data: RichTextProps }) {
  return (
    <section className="rich-text container mx-auto">
      <h2>{data.title}</h2>
      <BlocksRenderer content={data.description}/>
    </section>
  );
}
