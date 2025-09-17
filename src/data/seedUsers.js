import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const usersData = [
  {
    username: "alex_entrepreneur",
    email: "alex@example.com",
    fullName: "Alex Johnson",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "sarah_startup",
    email: "sarah@example.com",
    fullName: "Sarah Chen",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "mike_business",
    email: "mike@example.com",
    fullName: "Mike Rodriguez",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "emma_marketing",
    email: "emma@example.com",
    fullName: "Emma Thompson",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "david_saas",
    email: "david@example.com",
    fullName: "David Kim",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "lisa_ecommerce",
    email: "lisa@example.com",
    fullName: "Lisa Wang",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "james_sales",
    email: "james@example.com",
    fullName: "James Wilson",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "anna_finance",
    email: "anna@example.com",
    fullName: "Anna Kowalski",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "carlos_ideas",
    email: "carlos@example.com",
    fullName: "Carlos Martinez",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2379003/pexels-photo-2379003.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "rachel_growth",
    email: "rachel@example.com",
    fullName: "Rachel Green",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "tom_strategy",
    email: "tom@example.com",
    fullName: "Tom Anderson",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2182969/pexels-photo-2182969.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "sophia_tech",
    email: "sophia@example.com",
    fullName: "Sophia Lee",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239287/pexels-photo-1239287.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ryan_consulting",
    email: "ryan@example.com",
    fullName: "Ryan O'Connor",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2379006/pexels-photo-2379006.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "maya_innovation",
    email: "maya@example.com",
    fullName: "Maya Patel",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181685/pexels-photo-1181685.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "kevin_leadership",
    email: "kevin@example.com",
    fullName: "Kevin Brown",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2182974/pexels-photo-2182974.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "jacob_investor",
    email: "jacob@example.com",
    fullName: "Jacob Miller",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2379002/pexels-photo-2379002.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "olivia_creative",
    email: "olivia@example.com",
    fullName: "Olivia Davis",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181689/pexels-photo-1181689.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ethan_startup",
    email: "ethan@example.com",
    fullName: "Ethan Johnson",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239285/pexels-photo-1239285.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "madison_vision",
    email: "madison@example.com",
    fullName: "Madison Clark",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2182971/pexels-photo-2182971.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "logan_business",
    email: "logan@example.com",
    fullName: "Logan White",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181419/pexels-photo-1181419.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "avery_ventures",
    email: "avery@example.com",
    fullName: "Avery Scott",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2182973/pexels-photo-2182973.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "daniel_networks",
    email: "daniel@example.com",
    fullName: "Daniel Harris",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181687/pexels-photo-1181687.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "grace_marketing",
    email: "grace@example.com",
    fullName: "Grace Lewis",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378999/pexels-photo-2378999.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "nathan_future",
    email: "nathan@example.com",
    fullName: "Nathan Walker",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181416/pexels-photo-1181416.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "zoe_creativity",
    email: "zoe@example.com",
    fullName: "Zoe Hall",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239290/pexels-photo-1239290.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "christopher_growth",
    email: "christopher@example.com",
    fullName: "Christopher Allen",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378998/pexels-photo-2378998.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ella_entrepreneur",
    email: "ella@example.com",
    fullName: "Ella Adams",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181413/pexels-photo-1181413.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "mason_innovation",
    email: "mason@example.com",
    fullName: "Mason Young",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239286/pexels-photo-1239286.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "scarlett_ideas",
    email: "scarlett@example.com",
    fullName: "Scarlett King",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181418/pexels-photo-1181418.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "henry_enterprise",
    email: "henry@example.com",
    fullName: "Henry Moore",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2182976/pexels-photo-2182976.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "amelia_strategy",
    email: "amelia@example.com",
    fullName: "Amelia Perez",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239284/pexels-photo-1239284.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "jack_ventures",
    email: "jack@example.com",
    fullName: "Jack Rivera",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378996/pexels-photo-2378996.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "mia_networking",
    email: "mia@example.com",
    fullName: "Mia Ramirez",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181420/pexels-photo-1181420.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "alexander_vision",
    email: "alexander@example.com",
    fullName: "Alexander Campbell",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239283/pexels-photo-1239283.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "harper_future",
    email: "harper@example.com",
    fullName: "Harper Parker",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378997/pexels-photo-2378997.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "lucas_investments",
    email: "lucas@example.com",
    fullName: "Lucas Turner",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181417/pexels-photo-1181417.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "chloe_growth",
    email: "chloe@example.com",
    fullName: "Chloe Mitchell",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239282/pexels-photo-1239282.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "sebastian_leader",
    email: "sebastian@example.com",
    fullName: "Sebastian Scott",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378995/pexels-photo-2378995.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "aria_tech",
    email: "aria@example.com",
    fullName: "Aria Brooks",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181415/pexels-photo-1181415.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "benjamin_marketing",
    email: "benjamin@example.com",
    fullName: "Benjamin Gray",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239281/pexels-photo-1239281.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "lily_enterprise",
    email: "lily@example.com",
    fullName: "Lily Cooper",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378994/pexels-photo-2378994.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "matthew_network",
    email: "matthew@example.com",
    fullName: "Matthew Ward",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181412/pexels-photo-1181412.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "zoey_strategy",
    email: "zoey@example.com",
    fullName: "Zoey Price",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239280/pexels-photo-1239280.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "dylan_innovation",
    email: "dylan@example.com",
    fullName: "Dylan Sanders",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378993/pexels-photo-2378993.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "nora_inspire",
    email: "nora@example.com",
    fullName: "Nora Hughes",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181411/pexels-photo-1181411.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "elijah_consulting",
    email: "elijah@example.com",
    fullName: "Elijah Bryant",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239279/pexels-photo-1239279.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "hannah_future",
    email: "hannah@example.com",
    fullName: "Hannah Cox",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378992/pexels-photo-2378992.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "samuel_growth",
    email: "samuel@example.com",
    fullName: "Samuel Bell",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181410/pexels-photo-1181410.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "avery_vision",
    email: "avery2@example.com",
    fullName: "Avery Patterson",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239278/pexels-photo-1239278.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "jackson_investor",
    email: "jackson@example.com",
    fullName: "Jackson Torres",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378991/pexels-photo-2378991.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ella_consult",
    email: "ella2@example.com",
    fullName: "Ella Richardson",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181409/pexels-photo-1181409.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "jayden_strategy",
    email: "jayden@example.com",
    fullName: "Jayden Howard",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239277/pexels-photo-1239277.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "scarlett_inspire",
    email: "scarlett2@example.com",
    fullName: "Scarlett Ward",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378990/pexels-photo-2378990.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "gabriel_network",
    email: "gabriel@example.com",
    fullName: "Gabriel James",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181408/pexels-photo-1181408.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "sophia_innovator",
    email: "sophia2@example.com",
    fullName: "Sophia Brooks",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239276/pexels-photo-1239276.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "oliver_founder",
    email: "oliver.foster@example.com",
    fullName: "Oliver Foster",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378989/pexels-photo-2378989.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "zoe_strategy",
    email: "zoe.sanders@example.com",
    fullName: "Zoe Sanders",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181407/pexels-photo-1181407.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "owen_markets",
    email: "owen.bryant@example.com",
    fullName: "Owen Bryant",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239275/pexels-photo-1239275.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "scarlett_brand",
    email: "scarlett.holmes@example.com",
    fullName: "Scarlett Holmes",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378988/pexels-photo-2378988.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "leo_analytics",
    email: "leo.hunter@example.com",
    fullName: "Leo Hunter",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "isabella_design",
    email: "isabella.rivera@example.com",
    fullName: "Isabella Rivera",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239274/pexels-photo-1239274.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "jakob_dev",
    email: "jakob.hart@example.com",
    fullName: "Jakob Hart",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378987/pexels-photo-2378987.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "mia_ops",
    email: "mia.hayes@example.com",
    fullName: "Mia Hayes",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181405/pexels-photo-1181405.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "noah_product",
    email: "noah.morgan@example.com",
    fullName: "Noah Morgan",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239273/pexels-photo-1239273.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "luna_growth",
    email: "luna.dennis@example.com",
    fullName: "Luna Dennis",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378986/pexels-photo-2378986.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "caleb_corp",
    email: "caleb.stone@example.com",
    fullName: "Caleb Stone",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181404/pexels-photo-1181404.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "harper_comm",
    email: "harper.wells@example.com",
    fullName: "Harper Wells",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239272/pexels-photo-1239272.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ethan_ops",
    email: "ethan.phelps@example.com",
    fullName: "Ethan Phelps",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378985/pexels-photo-2378985.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ava_ux",
    email: "ava.mckinney@example.com",
    fullName: "Ava McKinney",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181403/pexels-photo-1181403.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "michael_sales",
    email: "michael.garcia@example.com",
    fullName: "Michael Garcia",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239271/pexels-photo-1239271.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ella_product",
    email: "ella.thompson2@example.com",
    fullName: "Ella Thompson",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378984/pexels-photo-2378984.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "liam_data",
    email: "liam.owens@example.com",
    fullName: "Liam Owens",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181402/pexels-photo-1181402.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "sophia_hr",
    email: "sophia.morris@example.com",
    fullName: "Sophia Morris",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239270/pexels-photo-1239270.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "logan_design",
    email: "logan.reed@example.com",
    fullName: "Logan Reed",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378983/pexels-photo-2378983.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "chloe_dev",
    email: "chloe.sutton@example.com",
    fullName: "Chloe Sutton",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181401/pexels-photo-1181401.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "sebastian_ops",
    email: "sebastian.ford@example.com",
    fullName: "Sebastian Ford",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239269/pexels-photo-1239269.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "mia_marketing",
    email: "mia.keller@example.com",
    fullName: "Mia Keller",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378982/pexels-photo-2378982.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "james_invest",
    email: "james.nolan@example.com",
    fullName: "James Nolan",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "amelia_prod",
    email: "amelia.payne@example.com",
    fullName: "Amelia Payne",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239268/pexels-photo-1239268.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "noah_support",
    email: "noah.wright@example.com",
    fullName: "Noah Wright",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378981/pexels-photo-2378981.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "lily_research",
    email: "lily.brooks2@example.com",
    fullName: "Lily Brooks",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181399/pexels-photo-1181399.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ethan_engineer",
    email: "ethan.holloway@example.com",
    fullName: "Ethan Holloway",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239267/pexels-photo-1239267.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "sophia_ceo",
    email: "sophia.crane@example.com",
    fullName: "Sophia Crane",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378980/pexels-photo-2378980.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "jackson_sales",
    email: "jackson.meyer@example.com",
    fullName: "Jackson Meyer",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181398/pexels-photo-1181398.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ava_ops",
    email: "ava.connor@example.com",
    fullName: "Ava Connor",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239266/pexels-photo-1239266.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "benjamin_prod",
    email: "benjamin.pace@example.com",
    fullName: "Benjamin Pace",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378979/pexels-photo-2378979.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "luna_hr",
    email: "luna.hartman@example.com",
    fullName: "Luna Hartman",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181397/pexels-photo-1181397.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "connor_developer",
    email: "connor.nash@example.com",
    fullName: "Connor Nash",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239265/pexels-photo-1239265.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "zoe_design",
    email: "zoe.martin2@example.com",
    fullName: "Zoe Martin",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378978/pexels-photo-2378978.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "miles_analyst",
    email: "miles.chandler@example.com",
    fullName: "Miles Chandler",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "nora_cofounder",
    email: "nora.lane@example.com",
    fullName: "Nora Lane",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239264/pexels-photo-1239264.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "jack_marketer",
    email: "jack.silva@example.com",
    fullName: "Jack Silva",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378977/pexels-photo-2378977.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "isla_engineering",
    email: "isla.fisher@example.com",
    fullName: "Isla Fisher",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "mason_strategy",
    email: "mason.kane@example.com",
    fullName: "Mason Kane",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239263/pexels-photo-1239263.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "ella_innovate",
    email: "ella.reese@example.com",
    fullName: "Ella Reese",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378976/pexels-photo-2378976.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "cameron_lead",
    email: "cameron.shepard@example.com",
    fullName: "Cameron Shepard",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181394/pexels-photo-1181394.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "lily_growth2",
    email: "lily.parker2@example.com",
    fullName: "Lily Parker",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239262/pexels-photo-1239262.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "gavin_ops",
    email: "gavin.miles@example.com",
    fullName: "Gavin Miles",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/2378975/pexels-photo-2378975.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "natalie_sales",
    email: "natalie.hayes2@example.com",
    fullName: "Natalie Hayes",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1181393/pexels-photo-1181393.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    username: "leo_founder2",
    email: "leo.grant@example.com",
    fullName: "Leo Grant",
    password: "password123",
    avatar:
      "https://images.pexels.com/photos/1239261/pexels-photo-1239261.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export async function seedUsers() {
  try {
    console.log("Seeding users...");

    // Check if users already exist
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      console.log(
        `Users already exist (${existingCount} found). Skipping seed.`
      );
      return;
    }

    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return {
          ...userData,
          password: hashedPassword,
        };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Successfully seeded ${createdUsers.length} users`);

    return createdUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}

export { usersData };
