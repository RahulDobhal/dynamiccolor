import React from "react";
import {
  Card,
  TextContent,
  IconButton,
  CardHeader,
  Image,
  Tag,
  TagBlock,
  Callout,
  ListItem,
  ListBlock,
  FollowUpItem,
  FollowUpBlock,
  Buttons,
  Button,
  Input,
  Label,
  RadioItem,
  RadioGroup,
  CheckBoxItem,
  CheckBoxGroup,
  Slider,
  TextArea,
  SwitchGroup,
  SwitchItem,
  DatePicker,
} from "@crayonai/react-ui";
import {
  Info as InfoIcon,
  Scan as ScanIcon,
  ListChecks as ListChecksIcon,
  Tag as TagIcon,
  FileClock as FileClockIcon,
  Check as CheckIcon,
  Clock10 as Clock10Icon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@crayonai/react-ui/Table";
import { StepsItem, Steps } from "@crayonai/react-ui/Steps";
import { FormControl, Hint } from "@crayonai/react-ui/FormControl";
import {
  SelectItem,
  SelectContent,
  SelectGroup,
  Select,
  SelectTrigger,
  SelectValue,
} from "@crayonai/react-ui/Select";
import {
  CarouselItem,
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@crayonai/react-ui/Carousel";
import {
  TabsTrigger,
  TabsContent,
  Tabs,
  TabsList,
} from "@crayonai/react-ui/Tabs";
import {
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
  Accordion,
} from "@crayonai/react-ui/Accordion";

const ChatComponents = () => {
  return (
    <div className="max-w-[700px]">
      <Card variant="card" width="standard">
        <TextContent variant="sunk">
          <p>Type response here.</p>
        </TextContent>
        <CardHeader
          title={<p style={{ textAlign: "left" }}>Write title here...</p>}
          subtitle={
            <p style={{ textAlign: "left" }}>Enter your subtitle here...</p>
          }
          icon={<InfoIcon size={"1em"} />}
          actions={
            <>
              <IconButton
                variant="tertiary"
                size="extra-small"
                shape="square"
                icon={<ScanIcon size={"1em"} />}
              />

              <IconButton
                variant="tertiary"
                size="extra-small"
                shape="square"
                icon={<ScanIcon size={"1em"} />}
              />

              <IconButton
                variant="tertiary"
                size="extra-small"
                shape="square"
                icon={<ScanIcon size={"1em"} />}
              />
            </>
          }
        />

        <Image
          src="https://via.placeholder.com/360x240"
          alt="Default Image Alt Text"
        />

        <TagBlock>
          <Tag
            icon={<InfoIcon size={"1em"} />}
            text={<p style={{ textAlign: "left" }}>Tag 1</p>}
          />
          <Tag
            icon={<InfoIcon size={"1em"} />}
            text={<p style={{ textAlign: "left" }}>Tag 2</p>}
          />
          <Tag
            icon={<InfoIcon size={"1em"} />}
            text={<p style={{ textAlign: "left" }}>Tag 3</p>}
          />
        </TagBlock>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead icon={<ListChecksIcon size={"1em"} />}>
                <p style={{ textAlign: "left" }}>Task Name</p>
              </TableHead>

              <TableHead icon={<TagIcon size={"1em"} />}>
                <p style={{ textAlign: "left" }}>Type</p>
              </TableHead>

              <TableHead icon={<FileClockIcon size={"1em"} />}>
                <p style={{ textAlign: "left" }}>Status</p>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>
                <p style={{ textAlign: "left" }}>Task 1</p>
              </TableCell>

              <TableCell>
                <p style={{ textAlign: "left" }}>General</p>
              </TableCell>

              <TableCell>
                <TagBlock>
                  <Tag
                    icon={<CheckIcon size={"1em"} />}
                    text={<p style={{ textAlign: "left" }}>Completed</p>}
                  />
                </TagBlock>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <p style={{ textAlign: "left" }}>Task 2</p>
              </TableCell>

              <TableCell>
                <p style={{ textAlign: "left" }}>General</p>
              </TableCell>

              <TableCell>
                <TagBlock>
                  <Tag
                    icon={<InfoIcon size={"1em"} />}
                    text={<p style={{ textAlign: "left" }}>To-Do</p>}
                  />
                </TagBlock>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <p style={{ textAlign: "left" }}>Task 3</p>
              </TableCell>

              <TableCell>
                <p style={{ textAlign: "left" }}>General</p>
              </TableCell>

              <TableCell>
                <TagBlock>
                  <Tag
                    icon={<Clock10Icon size={"1em"} />}
                    text={<p style={{ textAlign: "left" }}>In Progress</p>}
                  />
                </TagBlock>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Callout
          icon={<ScanIcon size={"1em"} />}
          title={<p>Enter title here...</p>}
          description={<p>Enter description here...</p>}
          variant="neutral"
        />

        <Steps>
          <StepsItem
            title={<p>Step Title</p>}
            details={
              <>
                <TextContent variant="sunk">
                  <p>Type response here.</p>
                </TextContent>
              </>
            }
          />

          <StepsItem
            title={<p>Step Title</p>}
            details={
              <>
                <TextContent variant="sunk">
                  <p>Type response here.</p>
                </TextContent>
              </>
            }
          />
        </Steps>

        <ListBlock>
          <ListItem
            decorativeIcon={<ScanIcon size={"1em"} />}
            title={
              <p style={{ textAlign: "left" }}>Enter first item here...</p>
            }
            subtitle={<p>Enter description here...</p>}
            actionIcon={<ScanIcon size={"1em"} />}
          />
          <ListItem
            decorativeIcon={<ScanIcon size={"1em"} />}
            title={
              <p style={{ textAlign: "left" }}>Enter second item here...</p>
            }
            subtitle={<p>Enter description here...</p>}
            actionIcon={<ScanIcon size={"1em"} />}
          />
          <ListItem
            decorativeIcon={<ScanIcon size={"1em"} />}
            title={
              <p style={{ textAlign: "left" }}>Enter third item here...</p>
            }
            subtitle={<p>Enter description here...</p>}
            actionIcon={<ScanIcon size={"1em"} />}
          />
        </ListBlock>

        <FollowUpBlock>
          <FollowUpItem
            text={
              <p style={{ textAlign: "left" }}>Enter first follow up here...</p>
            }
            icon={<ScanIcon size={"1em"} />}
          />
          <FollowUpItem
            text={
              <p style={{ textAlign: "left" }}>
                Enter second follow up here...
              </p>
            }
            icon={<ScanIcon size={"1em"} />}
          />
          <FollowUpItem
            text={
              <p style={{ textAlign: "left" }}>Enter third follow up here...</p>
            }
            icon={<ScanIcon size={"1em"} />}
          />
        </FollowUpBlock>

        <Buttons variant="horizontal">
          <Button variant="primary" size="medium">
            Button 1
          </Button>

          <Button variant="secondary" size="medium">
            Button 2
          </Button>
        </Buttons>

        <FormControl>
          <Label>
            <p>Enter Text</p>
          </Label>
          <Input placeholder={"Type here..."} />
        </FormControl>

        <FormControl>
          <Label>
            <p>Choose One Option</p>
          </Label>

          <RadioGroup variant="clear">
            <RadioItem
              value="YaH9"
              label={<p style={{ textAlign: "left" }}>Option 1</p>}
            />
            <RadioItem
              value="BrxT"
              label={<p style={{ textAlign: "left" }}>Option 2</p>}
            />
            <RadioItem
              value="1pnN"
              label={<p style={{ textAlign: "left" }}>Option 3</p>}
            />
          </RadioGroup>

          <Hint>
            <InfoIcon size={"1em"} />
            <p style={{ textAlign: "left" }}>Choose only one option</p>
          </Hint>
        </FormControl>

        <FormControl>
          <Label>
            <p>Choose Options</p>
          </Label>

          <CheckBoxGroup variant="clear">
            <CheckBoxItem
              label={<p style={{ textAlign: "left" }}>Option 1</p>}
            />
            <CheckBoxItem
              label={<p style={{ textAlign: "left" }}>Option 2</p>}
            />
            <CheckBoxItem
              label={<p style={{ textAlign: "left" }}>Option 3</p>}
            />
          </CheckBoxGroup>

          <Hint>
            <InfoIcon size={"1em"} />
            <p style={{ textAlign: "left" }}>You can select multiple options</p>
          </Hint>
        </FormControl>

        <FormControl>
          <Label>
            <p style={{ textAlign: "left" }}>Choose Item</p>
          </Label>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="d353">
                  <p style={{ textAlign: "left" }}>Option 1</p>
                </SelectItem>

                <SelectItem value="hiHT">
                  <p style={{ textAlign: "left" }}>Option 2</p>
                </SelectItem>

                <SelectItem value="YWdY">
                  <p style={{ textAlign: "left" }}>Option 3</p>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Hint>
            <InfoIcon size={"1em"} />
            <p style={{ textAlign: "left" }}>
              Pick an option from the dropdown list
            </p>
          </Hint>
        </FormControl>

        <FormControl>
          <Label>
            <p>Adjust Value</p>
          </Label>
          <Slider
            value={[0]}
            onValueChange={(value) => console.log(value)}
            variant="continuous"
            min={0}
            max={100}
            step={1}
          />

          <Hint>
            <InfoIcon size={"1em"} />
            <p style={{ textAlign: "left" }}>Slide to adjust</p>
          </Hint>
        </FormControl>

        <FormControl>
          <Label>
            <p>Enter Description</p>
          </Label>
          <TextArea placeholder="Type here..." />

          <Hint>
            <InfoIcon size={"1em"} />
            <p style={{ textAlign: "left" }}>Use this space extensive input</p>
          </Hint>
        </FormControl>

        <FormControl>
          <Label>
            <p>Enable Options</p>
          </Label>

          <SwitchGroup variant="clear">
            <SwitchItem label={<p style={{ textAlign: "left" }}>Option 1</p>} />

            <SwitchItem label={<p style={{ textAlign: "left" }}>Option 2</p>} />

            <SwitchItem label={<p style={{ textAlign: "left" }}>Option 3</p>} />
          </SwitchGroup>

          <Hint>
            <InfoIcon size={"1em"} />
            <p style={{ textAlign: "left" }}>Enable one or more options </p>
          </Hint>
        </FormControl>

        <FormControl>
          <Label>
            <p style={{ textAlign: "left" }}>Pick a Date</p>
          </Label>

          <DatePicker mode="single" />

          <Hint>
            <InfoIcon size={"1em"} />
            <p style={{ textAlign: "left" }}>
              <span>Choose a valid date from the calendar</span>
            </p>
          </Hint>
        </FormControl>

        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <Image
                src="<add image source here>"
                alt="Default Image Alt Text"
              />

              <CardHeader
                title={<p style={{ textAlign: "left" }}>Title 1</p>}
                subtitle={<p>Label goes here</p>}
              />
              <TagBlock>
                <Tag icon={<InfoIcon size={"1em"} />} text={<p>Tag</p>} />
                <Tag icon={<InfoIcon size={"1em"} />} text={<p>Tag</p>} />
              </TagBlock>
            </CarouselItem>

            <CarouselItem>
              <Image
                src="<add image source here>"
                alt="Default Image Alt Text"
              />

              <CardHeader
                title={<p style={{ textAlign: "left" }}>Title 2</p>}
                subtitle={<p>Label goes here</p>}
              />
              <TagBlock>
                <Tag icon={<InfoIcon size={"1em"} />} text={<p>Tag</p>} />
                <Tag icon={<InfoIcon size={"1em"} />} text={<p>Tag</p>} />
              </TagBlock>
            </CarouselItem>

            <CarouselItem>
              <Image
                src="<add image source here>"
                alt="Default Image Alt Text"
              />

              <CardHeader
                title={<p style={{ textAlign: "left" }}>Title 3</p>}
                subtitle={<p>Label goes here</p>}
              />
              <TagBlock>
                <Tag icon={<InfoIcon size={"1em"} />} text={<p>Tag</p>} />
                <Tag icon={<InfoIcon size={"1em"} />} text={<p>Tag</p>} />
              </TagBlock>
            </CarouselItem>
          </CarouselContent>

          <CarouselPrevious icon={<ChevronLeftIcon size={"1em"} />} />
          <CarouselNext icon={<ChevronRightIcon size={"1em"} />} />
        </Carousel>

        <Tabs defaultValue="Ulba">
          <TabsList>
            <TabsTrigger
              text={<p style={{ textAlign: "left" }}>Tab 1</p>}
              value="Ulba"
            />

            <TabsTrigger
              text={<p style={{ textAlign: "left" }}>Tab 2</p>}
              value="rlTN"
            />
          </TabsList>

          <TabsContent value="Ulba">
            <TextContent variant="clear">
              <p style={{ textAlign: "left" }}>Placeholder text for Tab 1</p>
            </TextContent>

            <Image src="<add image source here>" alt="Default Image Alt Text" />
          </TabsContent>

          <TabsContent value="rlTN">
            <TextContent variant="clear">
              <p style={{ textAlign: "left" }}>Placeholder text for Tab 2</p>
            </TextContent>

            <Image src="<add image source here>" alt="Default Image Alt Text" />
          </TabsContent>
        </Tabs>

        <Accordion type="multiple">
          <AccordionItem value="9ps6" variant="card">
            <AccordionTrigger
              text={<p style={{ textAlign: "left" }}>Accordion 1</p>}
            />

            <AccordionContent>
              <TextContent variant="clear">
                <p style={{ textAlign: "left" }}>
                  Placeholder text for Accordion 1
                </p>
              </TextContent>

              <Image
                src="<add image source here>"
                alt="Default Image Alt Text"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cWD4" variant="card">
            <AccordionTrigger
              text={<p style={{ textAlign: "left" }}>Accordion 2</p>}
            />

            <AccordionContent>
              <TextContent variant="clear">
                <p style={{ textAlign: "left" }}>
                  Placeholder text for Accordion 2
                </p>
              </TextContent>

              <Image
                src="<add image source here>"
                alt="Default Image Alt Text"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ZU7H" variant="card">
            <AccordionTrigger
              text={<p style={{ textAlign: "left" }}>Accordion 3</p>}
            />

            <AccordionContent>
              <TextContent variant="clear">
                <p style={{ textAlign: "left" }}>
                  Placeholder text for Accordion 3
                </p>
              </TextContent>

              <Image
                src="https://via.placeholder.com/360x240"
                alt="Default Image Alt Text"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default ChatComponents;
