import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fields = [
  {
    id: "full-name",
    label: "Full name",
    placeholder: "Jordan Lee",
    type: "text",
  },
  {
    id: "email",
    label: "Email",
    placeholder: "jordan@studio.dev",
    type: "email",
  },
  {
    id: "company",
    label: "Company",
    placeholder: "Codrops",
    type: "text",
  },
  {
    id: "website",
    label: "Website",
    placeholder: "https://example.com",
    type: "url",
  },
] as const;

export const Form = () => (
  <section className="mx-auto w-full max-w-xl px-4">
    <Card className="border-white/10 bg-white/95 shadow-2xl shadow-black/20">
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          e.currentTarget.reset();
        }}
      >
        <CardContent className="flex flex-col gap-6 pb-4">
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div className="flex flex-col gap-2" key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-type">Project type</Label>
              <Input
                id="project-type"
                name="project-type"
                placeholder="Marketing site, prototype, interactive demo..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="budget">Budget</Label>
              <Input id="budget" name="budget" placeholder="$5,000 - $10,000" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Input
              id="timeline"
              name="timeline"
              placeholder="Target launch in 4-6 weeks"
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="consent"
              name="consent"
              className="mt-0.5"
              defaultChecked
            />
            <div className="flex flex-col gap-1">
              <Label htmlFor="consent">
                I&apos;m happy to receive follow-up about this mock inquiry
              </Label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-border/60 justify-end border-t">
          <div className="flex items-center gap-2">
            <Button type="reset" variant="ghost">
              Clear
            </Button>
            <Button type="submit">Send inquiry</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  </section>
);
