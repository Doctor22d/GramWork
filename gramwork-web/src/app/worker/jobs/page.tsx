import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { MapPin, DollarSign, Search } from "lucide-react";

export default function WorkerJobsPage() {
  const dummyJobs = [
    { id: 1, title: "Farm Laborer Needed", employer: "Green Acres Farm", location: "Punjab", payout: "₹500/day", type: "Full-time", posted: "2 hours ago" },
    { id: 2, title: "Harvesting Assistant", employer: "Sunrise Orchards", location: "Haryana", payout: "₹600/day", type: "Temporary", posted: "1 day ago" },
    { id: 3, title: "Tractor Driver", employer: "Kisan Connect", location: "Uttar Pradesh", payout: "₹800/day", type: "Contract", posted: "3 days ago" },
    { id: 4, title: "Crop Sprayer", employer: "AgriTech Solutions", location: "Madhya Pradesh", payout: "₹700/day", type: "Seasonal", posted: "1 week ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Jobs</h1>
          <p className="text-muted-foreground">Find and apply for the latest agricultural opportunities.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search jobs..." className="pl-8 bg-background" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyJobs.map((job) => (
          <Card key={job.id} className="transition-all hover:shadow-md border-primary/10">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="mb-2">{job.type}</Badge>
                <span className="text-xs text-muted-foreground">{job.posted}</span>
              </div>
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription>{job.employer}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" /> {job.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="mr-2 h-4 w-4 text-green-600" /> {job.payout}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
