import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationType } from '../datatypes/OrganizationType';
import { Utility } from '../utils/Utility';

export class PlatformInfoViewModel {

  private _id: string;
  private _externalPlatformId: string;
  private _name: string;
  private _description: string;
  private _country: string;
  private _type: OrganizationType;
  private _logo: string;

  constructor(
    id: string,
    name: string,
    description: string,
    country: string,
    type: OrganizationType,
    logo: string,
    externalPlatformId: string = null
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._country = country;
    this._type = type;
    this._logo = logo;
    this._externalPlatformId = externalPlatformId;
  }

  get id(): string { return this._id; }
  get externalPlatformId(): string { return this._externalPlatformId; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get country(): string { return this._country; }
  get type(): OrganizationType { return this._type; }
  get logo(): string { return this._logo; }
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private readonly _httpClient: HttpClient) { }

  private static platforms: PlatformInfoViewModel[] = [
    new PlatformInfoViewModel('rover.com', 'Bonsai', 'Bonsai är din bästa vän när du behöver personal.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/bonsai.png'),
    new PlatformInfoViewModel('bizzcoo.com', 'Bizzcoo', 'We accelerate your business.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/bizzcoo.png'),
    new PlatformInfoViewModel('budbee.com', 'Budbee', 'Delivering in time for life.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/budbee.png'),
    new PlatformInfoViewModel('care.com', 'Care.com', 'Bättre hjälp börjar här.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/care.png'),
    new PlatformInfoViewModel('diretto.se', 'Diretto',
      'Vi vill skapa nya vägar in på arbetsmarknaden och alternativa sätt att jobba.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/diretto.png'),
    new PlatformInfoViewModel('fiverr.com', 'Fiverr', 'Freelance services for the lean entrepreneur.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/fiverr.png'),
    new PlatformInfoViewModel('foodora.se', 'Foodora', 'Din favoritmat levererad - direkt till dig.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/foodora.png'),
    new PlatformInfoViewModel('freeeelancer.com', 'Freelancer',
      'Hire expert freelancers for any job, online', 'USA', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/freelancer.png',
      '5846584a-2719-48dd-bef2-83c6d7dbd421'),
    new PlatformInfoViewModel('gigger.se', 'Gigger', 'Hitta uppdrag, extrajobb och fakturera utan eget företag.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/gigger.png'),
    new PlatformInfoViewModel('gigstr.se',
      'Gigstr', 'Gigstr är ett nordiskt community av människor redo att representera ditt varumärke i butik, på event & som säljkår.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/gigstr.png'),
    new PlatformInfoViewModel('gigway.se', 'Gigway', 'Hire Stockholm’s best freelancers.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/gigway.png'),
    new PlatformInfoViewModel('talent.hubstaff.com', 'Hubstaff Talent',
      'The FREE way to find the world’s best remote talent.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/gigway.png'),
    new PlatformInfoViewModel('hungrig.se', 'Hungrig', 'Din favoritmat levererad på 45 min.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/hungrig.png'),
    new PlatformInfoViewModel('instajobs.com', 'Instajobs', 'Hitta och hyr in extra-personal vid behov.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/instajobs.png'),
    new PlatformInfoViewModel('instawork.com', 'Instawork',
      'Where hospitality businesses and talent find each other.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/instawork.png'),
    new PlatformInfoViewModel('jappa.jobs', 'Jappa', 'Att jobba på dina villkor har aldrig varit enklare.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/jappa.png'),
    new PlatformInfoViewModel('justarrived.se', 'Just Arrived', 'Bemanning med fokus på utrikesfödda.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/justarrived.png'),
    new PlatformInfoViewModel('lingoda.com', 'Lingoda',
      'Lingoda offers online language lessons with qualified native speaking teachers.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/lingoda.png'),
    new PlatformInfoViewModel('mishma.sh', 'Mishmash', 'Your side-hustle turned into business.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/mishmash.png'),
    new PlatformInfoViewModel('noxconsulting.se', 'Nox Consulting',
      'Inte den traditionella konsultförmedlaren.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/noxconsulting.png'),
    new PlatformInfoViewModel('peopleperhour.com', 'People per hour', 'Live your work dream.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/instajobs.png'),
    new PlatformInfoViewModel('preply.com', 'Preply',
      'Learn anything faster with the world’s best one-on-one online tutors.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/preply.png'),
    new PlatformInfoViewModel('rover.com', 'Rover',
      'The world’s largest network of 5‑star pet sitters and dog walkers.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/rover.png'),
    new PlatformInfoViewModel('skillshare.com', 'Skillshare',
      'Thousands of classes to fuel your creativity and career.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/skillshare.png'),
    new PlatformInfoViewModel('simpell.se', 'Simpell',
      'Hitta rätt frilansare för uppdraget.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/simpell.png'),
    new PlatformInfoViewModel('taskrabbit.com', 'Taskrabbit',
      'The convenient & fast way to get things done around the house.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/taskrabbit.png'),
    new PlatformInfoViewModel('taskrunner.com', 'Taskrunner', 'Taskrunner fixar det du inte orkar.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/taskrunner.png'),
    new PlatformInfoViewModel('techbuddy.se', 'Techbuddy', 'Vi löser dina teknikproblem.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/techbuddy.png'),
    new PlatformInfoViewModel('techtroopers.se', 'Techtroopers',
      'Tech Troopers hjälper dig med att få din hemelektronik att fungera.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/techtroopers.png'),
    new PlatformInfoViewModel('thumbtack.com', 'Thumbtack', 'Consider it done.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/thumbtack.png'),
    new PlatformInfoViewModel('tidyapp.se', 'Tidyapp', 'TidyApp är en förmedlingsplattform inom hemstäd.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/tidyapp.png'),
    new PlatformInfoViewModel('tiptapp.com', 'Tiptapp', 'Help is on the way!',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/tiptapp.png'),
    new PlatformInfoViewModel('triple.co', 'Triple', 'The best way to experience a city',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/triple.png'),
    new PlatformInfoViewModel('uber.com', 'Uber', 'Vi skapar möjligheter genom att sätta världen i rörelse.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/uber.png'),
    new PlatformInfoViewModel('ubereats.com', 'Uber Eats',
      'Uber Eats is the easy way to get the food you love delivered.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/ubereats.png'),
    new PlatformInfoViewModel('udemy.com', 'Udemy', 'The leading global marketplace for learning and instruction.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/udemy.png'),
    new PlatformInfoViewModel('upwork.com', 'Upwork',
      'Grow your own freelance business with Upwork and never run out of clients.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/upwork.png'),
    new PlatformInfoViewModel('urb-it.com', 'Urb-it', 'Eco-labelled same day deliveries.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/urbit.png'),
    new PlatformInfoViewModel('woshapp.se', 'Woshapp', 'Biltvätten som kommer till dig.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/woshapp.png'),
    new PlatformInfoViewModel('wolt.com', 'Wolt', 'Discover and get great food.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/wolt.png'),
    new PlatformInfoViewModel('workpilots.com', 'Work Pilots', 'Find the help you need effortlessly.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/workpilots.png'),
    new PlatformInfoViewModel('yepstr.com', 'Yepstr', 'Find the help you need effortlessly.',
      'Sweden', OrganizationType.PrivateCompany, 'assets/gfx/platform-icons/yepstr.png')
  ];

  getPlatforms(): PlatformInfoViewModel[] {
    return PlatformService.platforms;
  }
}
