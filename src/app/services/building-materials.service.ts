/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { BuildingMaterial} from '../modals/building-materials-product.modal';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface BuildingMaterialData {
  title: string;
  category: string;
  description: string;
  image: string;
  productTypes: string[];
  productImages: string[];
  productPrices: number[];
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BuildingMaterialsService {
  private directory = '../../assets/products/building_materials/';
  private imgDir = '../../assets/products/details/';
  private databaseLocation = 'https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/products/building-materials.json';

  private _products = new BehaviorSubject<BuildingMaterial[]>([]);

  // private _products: BuildingMaterial[] = [
  //   new BuildingMaterial(
  //     'p1',
  //     'Additives',
  //     'Building Materials',
  //     'Natural or synthetic materials that are mixed into binding agents, concretes, and mortars to impart the required properties to the finished product and reduce its cost.',
  //     this.directory +  'additive.png',
  //     ['Alcolin Permobond Concentrated', 'Handyman\'s Bondseal', 'Permoplaster Ready To Use', 'Drikon A Shak - 5L', 'Plasta Kee Abebond - 5L', 'Plasta Kee Abebond - 25L', 'Alcolin Permo-Key Slurry Kit- 15KG', 'Alcolin Latex-Bond - 5L', 'Tyrolene Machine'],
  //     [this.imgDir + 'additives/alcolinPermobondConcentrated.jpg', this.imgDir + 'additives/handymansBondseal.jpg', this.imgDir + 'additives/permoplasterReadyToUse.jpeg', this.imgDir + 'additives/drikonAShak.webp', this.imgDir + 'additives/plastaKeeAbebond.webp', this.imgDir + 'additives/plastaKeeAbebond_25l.webp', this.imgDir + 'additives/alcolinPermoKeySlurryKit.jpg', this.imgDir + 'additives/alcolinLatexBond.webp', this.imgDir + 'additives/tyroleneMachine.webp'],
  //     [199.95, 249.95, 89.95, 454.99, 174.98, 809.00, 589.00, 264.99, 269.99],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p2',
  //     'Boards',
  //     'Building Materials',
  //     'A construction material made of a mixture of cement, sand, stone, and water that hardens to a stonelike mass',
  //     this.directory +  'concrete_products.jpg',
  //     ['Tongue & Groove Board - 2.40M', 'Tongue & Groove Board - 3.00M', 'Tongue & Groove Board - 3.00M', 'Windowsill - 1.22M', 'Windowsill - 2M', 'Windowsill - 2.489M', 'Slab Box: Block & Lintel Radient'],
  //     [this.imgDir + 'boards/tongueGrooveBoard.jpeg', this.imgDir + 'boards/tongueGrooveBoard.jpeg', this.imgDir + 'boards/tongueGrooveBoard.jpeg', this.imgDir + 'boards/windowsills.jpeg', this.imgDir + 'boards/windowsills.jpeg', this.imgDir + 'boards/windowsills.jpeg', this.imgDir + 'boards/slabBox.jpeg'],
  //     [464.99, 538.99, 689.00, 184.99, 359.98, 459.99, 322.87],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p3',
  //     'Blocks',
  //     'Building Materials',
  //     'Brick and concrete block are the major materials, brick being favoured for exterior surfaces because of its appearance and durability. Solid brick walls are rarely used, due to the higher labour and material costs; composite walls of brick and block or block alone are common.',
  //     this.directory +  'block.png',
  //     ['Brick Cement Block', 'Building Block - 140MM', 'Building Block - 190MM', 'Building Block - 90MM'],
  //     [this.imgDir + 'blocks/brickCementBlock.jpeg', this.imgDir + 'blocks/buildingBlock_140.jpeg', this.imgDir + 'blocks/buildingBlock_190.jpeg', this.imgDir + 'blocks/buildingBlock_90.jpeg'],
  //     [6.37, 11.95, 13.95, 9.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p4',
  //     'BrickForce',
  //     'Building Materials',
  //     'Brickforce is a ladder type masonry reinforcement that consists of two parallel flattened main wires joined by electrically welded cross wires. It is placed horizontally in the mortar beds of masonry walls to distribute loads, control cracking and also facilitates the use of thinner walls and/or greater spans.',
  //     this.directory +  'brickForce.jpg',
  //     ['Brick Force Galvanised - 20M',  'Brick Force Roll - 15M', 'Welded Mesh - 30M', 'Welded Mesh Ref - 4M', 'Welded Mesh Galvanised - 30M', 'Brick Force - 150MM', 'Brick Force - 2.8MM', 'Brick Force - 2.8MM', 'Brick Force - 57MM'],
  //     [this.imgDir + 'brick_force/brickForceGalvanised.jpg', this.imgDir + 'brick_force/brickForceRoll.jpg', this.imgDir + 'brick_force/weldedMeshGalv.jpeg', this.imgDir + 'brick_force/weldedMeshRef.jpeg', this.imgDir + 'brick_force/weldedMeshGalv_.jpeg', this.imgDir + 'brick_force/brickForce_150.jpg', this.imgDir + 'brick_force/brickForce_2.8.jpg', this.imgDir + 'brick_force/brickForce_2.8.0.jpg', this.imgDir + 'brick_force/brickForce_57.jpg'],
  //     [51.99, 29.99, 3129.00, 399.99, 2678.99, 47.95, 84.95, 84.95, 84.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p5',
  //     'Bricks',
  //     'Building Materials',
  //     'A brick is a type of block used to build walls, pavements and other elements in masonry construction. Properly, the term brick denotes a block composed of dried clay, but is now also used informally to denote other chemically cured construction blocks.',
  //     this.directory +  'brick.png',
  //     ['Brick Cement Stock', 'Brick Cement Maxi', 'Brick Paver Red', 'Cement Plaster Brick', 'Clay Hollow Maxi Brick', 'Face Brick Nebraska Travertine', 'Face Brick Iron Spot', 'Fire Brick', 'Fire Brick - 25 MM', 'Glass Brick Flemish Pattern', 'Plaster Brick Cement Maxi Hollow', 'Plaster Brick Rok Hollow', 'Rok Plaster Brick', 'Terrablock R12 Rockface', 'Terrablock R11 Rockface', 'Terrablock L11 Smooth', 'Terrablock L12 Smooth', 'Brick Face Blue Barley Travertine', 'Brick Face Golden Wheat', 'Brick Face Nebrasks Travertine', 'Brick Travertine Cathcart', 'Brick Travertine Dark Cathcart', 'Brick Face County Classic Satin', 'Brick Travertine Nebraska', 'Brick Face Montana Travetine', 'Brick Face Fynbos Yellow', 'Brick Face Fynbos Red', 'Brick Face Topaz Satin', 'Brick Bergendal Satin Blend', 'Brick Agate Satin', 'Brick Agate Trav'],
  //     [this.imgDir + 'bricks/brickCementStock.jpeg', this.imgDir + 'bricks/brickCementMaxi.jpeg', this.imgDir + 'bricks/brickPaverRed_73.jpg', this.imgDir + 'bricks/cementPlasterBrick.jpeg', this.imgDir + 'bricks/clayHollowMaxiBrick.jpeg', this.imgDir + 'bricks/faceBrickNebraskaTravertine.jpg', this.imgDir + 'bricks/faceBrickIronSpot.jpeg', this.imgDir + 'bricks/fireBrick.jpg', this.imgDir + 'bricks/fireBrick_25.jpeg', this.imgDir + 'bricks/glassBrickFlemishPattern.jpeg', this.imgDir + 'bricks/plasterBrickCementMaxiHollow.jpg', this.imgDir + 'bricks/plasterBrickRokHollow.jpg', this.imgDir + 'bricks/rokPlasterBrick.jpeg', this.imgDir + 'bricks/terrablockRockface_r12.jpg', this.imgDir + 'bricks/terrablockRockface_r11.jpg', this.imgDir + 'bricks/terrablockSmooth_l11.jpg', this.imgDir + 'bricks/terrablockSmooth_l12.jpg', this.imgDir + 'bricks/brickFaceBlueBarley.jpg', this.imgDir + 'bricks/brickFaceGoldenWheat.jpeg', this.imgDir + 'bricks/brickFaceNebraskaTravertine.jpg', this.imgDir + 'bricks/brickTravertineFBSCathcart.jpeg', this.imgDir + 'bricks/brickTravertine.jpeg', this.imgDir + 'bricks/brickFaceCountyClassicSatin.jpeg', this.imgDir + 'bricks/brickTravertineNebraska.jpeg', this.imgDir + 'bricks/brickFaceMontanaTravetine.jpeg', this.imgDir + 'bricks/brickFaceFynbosYellow.jpeg', this.imgDir + 'bricks/brickFaceFynbosRed.jpeg', this.imgDir + 'bricks/brickFaceTopaz.jpeg', this.imgDir + 'bricks/brickBergendalSatinBlend.jpeg', this.imgDir + 'bricks/brickAgateSatin.jpeg', this.imgDir + 'bricks/brickAgateTrav.jpeg'],
  //     [2.54, 3.77, 9.95, 2.90, 3.90, 7.50, 6.95, 59.95, 37.95, 69.95, 3.00, 3.00, 3.20, 74.95, 94.95, 69.95, 54.95, 6.38, 6.38, 6.59, 6.10, 9.09, 7.89, 6.51, 6.31, 5.68, 4.77, 7.76, 4.82, 13.33, 13.67],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p6',
  //     'Building Columns',
  //     'Building Materials',
  //     'A column or pillar in architecture and structural engineering is a structural element that transmits, through compression, the weight of the structure above to other structural elements below. In other words, a column is a compression member.',
  //     this.directory +  'column.png',
  //     ['Pillar Set Stainless Steel Square - 2M Set', 'Pillar Halo Stainless Steel - 2M Set', 'Pillar Diamond Stainless Steel - 2M Set', 'Pillar Classic Stainless Steel - 2M Set', 'Building Column Cap Universal - 200mm Nutec'],
  //     [this.imgDir + 'building_columns/pillarSetStainlessSteelSquare.jpeg', this.imgDir + 'building_columns/pillarHaloStainlessSteel.jpeg', this.imgDir + 'building_columns/pillarDiamondStainlessSteel.jpeg', this.imgDir + 'building_columns/pillarClassicStainlessSteel.jpeg', this.imgDir + 'building_columns/buildingColumnCapUniversal.jpeg'],
  //     [779.00, 718.99, 829.00, 779.00, 224.99],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p7',
  //     'Burglar Bars',
  //     'Building Materials',
  //     'Most burglar bars are made of metal, usually steel, aluminium, or iron. Some designers also use wrought iron which they prefer for its strength, thickness, and durability. Some modern security bars are made from polycarbonates, although these are less common than metal bars.',
  //     this.directory +  'burglar_bars.jpg',
  //     ['Duro Plastic Security Burglar Bars'],
  //     [this.imgDir + 'burglar_bars/duroPlasticSecurityBurglarBars.png'],
  //     [79.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p8',
  //     'Cement',
  //     'Building Materials',
  //     'A cement is a binder, a substance used for construction that sets, hardens, and adheres to other materials to bind them together. Cement is seldom used on its own, but rather to bind sand and gravel together. Cement mixed with fine aggregate produces mortar for masonry, or with sand and gravel, produces concrete.',
  //     this.directory +  'cement.png',
  //     ['Cement Starbuild Afrisam - 50KG', 'Cement All Purpose Afrisam - 50KG', 'Cement Durabuild Lafarge - 50KG', 'Cement Buildcrete Lafarge - 50KG', 'Cement Original Blue NPC - 50KG', 'Cement Sephaku - 50KG', 'Cement Original Black NPC - 50KG', 'Oxide Universal Yellow - 500G Medal', 'Cement Infrabuild - 50KG'],
  //     [this.imgDir + 'cement/cementStarbuildAfrisam.jpeg', this.imgDir + 'cement/cementAllPurposeAfrisam.jpeg', this.imgDir + 'cement/cementDurabuildLafarge.webp', this.imgDir + 'cement/cementBuildcreteLafarge.webp', this.imgDir + 'cement/cementOriginalBlueNPC.jpeg', this.imgDir + 'cement/cementSephaku.webp', this.imgDir + 'cement/cementOriginalBlackNPC.jpeg', this.imgDir + 'cement/oxideUniversalYellow.webp', this.imgDir + 'cement/cementInfrabuild.webp'],
  //     [79.58, 110.18, 85.99, 96.57, 80.73, 93.69, 86.73, 7.99, 85.77],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p9',
  //     'Cleaning Products',
  //     'Building Materials',
  //     'The most common ingredients in household cleaning products include alkalies, acids, detergents, abrasives, sanitizers, and spirit solvents.',
  //     this.directory +  'cleaning.png',
  //     ['Spirit Of Salts'],
  //     [this.imgDir + 'cleaning_products/spiritOfSalts.jpg'],
  //     [59.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p10',
  //     'Concrete products',
  //     'Building Materials',
  //     'A construction material made of a mixture of cement, sand, stone, and water that hardens to a stonelike mass',
  //     this.directory +  'concrete_products.jpg',
  //     [],
  //     [],
  //     [],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p11',
  //     'Cast Iron',
  //     'Building Materials',
  //     'Cast iron has good compressive strength and was successfully used for structural components that were largely in compression in well-designed bridges and buildings. In a few instances bridges and buildings built with cast iron failed when misused.',
  //     this.directory +  'crucible.png',
  //     [],
  //     [],
  //     [],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p12',
  //     'Fencing',
  //     'Building Materials',
  //     'Image result for building material fencing Wood is an attractive, classic material that works in any yard style. It\'s also cheaper than other options like vinyl privacy fencing or masonry fencing materials. Cedar, teak and redwood are popular fencing material types for their durable and long-lasting properties.',
  //     this.directory +  'fence.png',
  //     ['S.A Pine Picket Fence', 'S.A Pine Picket Gates'],
  //     [this.imgDir + 'fence/saPinePicketFence.jpg', this.imgDir + 'fence/saPinePicketGates.jpg'],
  //     [319.95, 219.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p13',
  //     'Glass',
  //     'Building Materials',
  //     'Glass Building Material is a mixture of raw materials like silica, sodium potassium carbonate, lime or lead oxide, manganese oxide which are grounded, sieved, and mixed in specific proportion to make glass. Glass Building Material has unique properties as a transparent glazing material in the construction industry.',
  //     this.directory +  'glass.png',
  //     [],
  //     [],
  //     [],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p14',
  //     'Galvanized Extrusions',
  //     'Building Materials',
  //     'What Types of Metal Can Be Galvanized? Iron and steel are the two most common types of metals that are galvanized. However, they are not the only types of metal that can receive this treatment. Most ferrous metals are able to be galvanized, while most non-ferrous metals are not able to be galvanized.',
  //     this.directory +  'clue.png',
  //     ['Angle Iron - 3M', 'Black Steel Tubing - 3M', 'Flat Iron - 3M', 'Rectangular Tubing - 3M', 'Round Galvanised Carport Post'],
  //     [this.imgDir + 'galvanized_extrusions/angleIron_3.jpeg', this.imgDir + 'galvanized_extrusions/blackSteelTubing_3.jpeg', this.imgDir + 'galvanized_extrusions/flatIron_3.jpeg', this.imgDir + 'galvanized_extrusions/rectangularTubing_3.jpeg', this.imgDir + 'galvanized_extrusions/roundGalvanisedCarportPost.jpg'],
  //     [124.95, 109.95, 94.95, 184.95, 299.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p15',
  //     'General Building Supplies',
  //     'Building Materials',
  //     'The cost of building materials in South Africa has generally increased in the last 5 years. The following examples indicate the average prices of some basic materials: 1000 bricks – R1500 to R6000. 1000 roof tiles – R1200 to R4000.',
  //     this.directory +  'general_building_supplies.png',
  //     ['Air Vent Vermin Proof Cement Grey', 'Air Vent Vermin Proof PVC Plain White', 'Air Vent Vermin Proof PVC Terracotta - Brown', 'Bester Wheelbarrow Ecco Plastic', 'Bester Wheelbarrow Farmers Barrow', 'Bester Wheelbarrow Ramkat Elite', 'Bester Wheelbarrow The Gardener', 'Brick Force - 75MM', 'Broekielace Double Corner White', 'Broekielace Single Corner White', 'Broekielace Single Straight White', 'Bucket Builders Plastic Round', 'Butterfly Ties - 205MM (Per 100)', 'D.P.C BrickGrip Micron (SABS)'],
  //     [this.imgDir + 'general_building_supplies/airVentVerminProofCementGrey.jpg', this.imgDir + 'general_building_supplies/airVentVerminProofPVCPlainWhite.jpg', this.imgDir + 'general_building_supplies/airVentVerminProofPVCTerracottaBrown.jpg', this.imgDir + 'general_building_supplies/besterWheelbarrowEccoPlastic.jpg', this.imgDir + 'general_building_supplies/besterWheelbarrowFarmersBarrow.jpg', this.imgDir + 'general_building_supplies/besterWheelbarrowRamkatElite.jpg', this.imgDir + 'general_building_supplies/besterWheelbarrowTheGardener.jpg', this.imgDir + 'general_building_supplies/brickForce_75.jpg', this.imgDir + 'general_building_supplies/broekielaceDoubleCornerWhite.jpg', this.imgDir + 'general_building_supplies/broekielaceSingleCornerWhite.jpg', this.imgDir + 'general_building_supplies/broekielaceSingleStraightWhite.jpg', this.imgDir + 'general_building_supplies/bucketBuildersPlasticRound.jpg', this.imgDir + 'general_building_supplies/butterflyTies_205.jpg', this.imgDir + 'general_building_supplies/dpcBrickgripMicron_375.jpeg'],
  //     [49.95, 5.95, 8.95, 1999.00, 2249.00, 2149.00, 1849.00, 47.95, 99.95, 89.95, 89.95, 49.95, 199.95, 74.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p16',
  //     'Gypsum Rhino Products',
  //     'Building Materials',
  //     'None',
  //     this.directory +  'rhino.png',
  //     ['DAS Polystyrene Cornice Adhesive', 'Fibatape For Rhino Board Ceilings - 45M', 'Gyproc Cretestone - 40KG', 'Polystyrene Ceiling Tile', 'Polystyrene Ceiling Cornice - 2M'],
  //     [this.imgDir + 'gypsum_rhino/dasPolystyreneCorniceAdhesive.jpeg', this.imgDir + 'gypsum_rhino/fibatapeForRhinoBoardCeilings.jpg', this.imgDir + 'gypsum_rhino/gyprocCretestone_40.jpg', this.imgDir + 'gypsum_rhino/polystyreneCeilingTile.jpeg', this.imgDir + 'gypsum_rhino/polystyreneCeilingCornice_2.jpg'],
  //     [34.95, 34.95, 329.95, 114.95, 99.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p17',
  //     'Ladders & Trolleys',
  //     'Building Materials',
  //     'None',
  //     this.directory +  'ladder.png',
  //     ['3 Step Ladder Color With Curved handle', '6 Step Aluminium Ladder With Handrail', '8 Step Alu Platform', 'Aluminium 3-in-1 Combination Ladder', 'Aluminium Double Extension Ladder', 'Aluminium Platform Ladder', 'Brights 6 Step Aluminium Ladder', 'Brights 8 Step Aluminium Ladder', 'Double Sided Stairway Ladder', 'Ladder Steel Epoxy Coated', 'Ladder 2 Step Colour With Curved Handle', 'Maxe 6 Step Fibreglass Ladder', 'Maxe 8 Step Fibreglass Ladder', 'Maxi 2-in-1 Ladder Truck Trolley', 'Maxi Folding Hand Trolley', 'Maxi Folding Nose Trolley'],
  //     [this.imgDir + 'ladders/3_stepLadderColourWithCurvedHandle.jpg', this.imgDir + 'ladders/6_stepAluminiumLadderWithHandrail.jpg', this.imgDir + 'ladders/8_stepAluPlatform.png', this.imgDir + 'ladders/aluminium_3in_1combinationLadder.png', this.imgDir + 'ladders/aluminiumDoubleExtensionLadder.jpg', this.imgDir + 'ladders/aluminiumPlatformLadder.jpg', this.imgDir + 'ladders/brights_6stepAluminiumLadder.jpeg', this.imgDir + 'ladders/brights_8stepAluminiumLadder.jpeg', this.imgDir + 'ladders/doubleSidedStairwayLadder.jpg', this.imgDir + 'ladders/ladderSteelEpoxyCoated.jpeg', this.imgDir + 'ladders/ladder_2stepColourWithCurvedHandle.jpg', this.imgDir + 'ladders/maxe_6stepFibreglassLadder.jpg', this.imgDir + 'ladders/maxe_6stepFibreglassLadder.jpg', this.imgDir + 'ladders/maxi_2in_1ladderTruckTrolley.jpg', this.imgDir + 'ladders/maxiFoldingHandTrolley.jpg', this.imgDir + 'ladders/maxiFoldingNoseTrolly.png'],
  //     [759.95, 1949.00, 2699.00, 2549.00, 4499.00, 1549.00, 1249.00, 1549.00, 1999.00, 699.95, 619.95, 1799.00, 2349.00, 1249.00, 999.95, 1799.00],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p18',
  //     'Laminated Flooring',
  //     'Building Materials',
  //     'Laminate is a multi-layer synthetic flooring product. It is designed to imitate the appearance of real wood. The core layer of laminate flooring is manufactured primarily from melamine resin and fiber board material. The top layer has an imprinted textured image made to look like real wood.',
  //     this.directory +  'flooring.png',
  //     ['Sylvan Laminated Flooring'],
  //     [this.imgDir + 'flooring/sylvanLaminatedFlooring.jpeg'],
  //     [349.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p19',
  //     'Landscaping',
  //     'Building Materials',
  //     'Also known as the hardscape, common construction materials are the building blocks for creating a winning landscape design for your home.',
  //     this.directory +  'landscaping.png',
  //     ['Drain Channel - 1M'],
  //     [this.imgDir + 'landscaping/drainChannel.jpeg'],
  //     [219.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p20',
  //     'Lintels',
  //     'Building Materials',
  //     'A lintel or lintol is a type of beam (a horizontal structural element) that spans openings such as portals, doors, windows and fireplaces. It can be a decorative architectural element, or a combined ornamented structural item.',
  //     this.directory +  'lintels.png',
  //     ['Lintel Concrete'],
  //     [this.imgDir + 'lintels/lintelConcrete.jpeg'],
  //     [821.50],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p21',
  //     'Nutec Products',
  //     'Building Materials',
  //     'None',
  //     this.directory +  'clue.png',
  //     [],
  //     [],
  //     [],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p22',
  //     'Reinforcing & Underlay',
  //     'Building Materials',
  //     'Bars, wires, strands, fibers, or other slender elements that are embedded in a matrix such that they act together to resist forces.- ACI Concrete Terminology. Most concrete used for construction is a combination of concrete and reinforcement that is called reinforced concrete.',
  //     this.directory +  'reinforcing.png',
  //     ['Plastic Sheet GP Yellow - 30M', 'Nylon Head Replacement White - 2Pce', 'Wall Ties Butterfly - 255MM', 'Reinforcing Y Bar - 8MM'],
  //     [this.imgDir + 'reinforcing_underlay/plasticSheetGPYellow.jpeg', this.imgDir + 'reinforcing_underlay/nylonHeadReplacementWhite.jpeg', this.imgDir + 'reinforcing_underlay/wallTiesButterflyGalv.jpeg', this.imgDir + 'reinforcing_underlay/reinforcingYBar.jpeg'],
  //     [184.99, 124.99, 214.99, 66.99], //55.99,
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p23',
  //     'Security products',
  //     'Building Materials',
  //     'None',
  //     this.directory +  'shield.png',
  //     ['Armourdoor Aluminium Flex Burglar Gate', 'Armourdoor Aluminium Trellis Burglar Gate'],
  //     [this.imgDir + 'security/armourdoorAluminiumFlexBurglarGate.jpg', this.imgDir + 'security/armourdoorAluminiumTrellisBurglarGate.jpeg'],
  //     [2099.00, 3549.00],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p24',
  //     'Shelves',
  //     'Building Materials',
  //     'Broadly speaking, the main materials that are used to construct industrial shelving are metal and wood. These include steel, aluminium, copper, chrome, plywood, koa and oak.',
  //     this.directory +  'shelves.png',
  //     ['Mak Rok Cross Brace', 'Mak Rak Screw & Key Pack', 'Mak Rak Slimline Shelf - 300MM', 'Mak Rak Slimline Shelf - 400MM', 'Mak Rak Slimline Shelf - 500MM', 'Mak Rak Slimline Shelf - 600MM', 'Mak Rak Standard Shelf - 300MM', 'Mak Rak Standard Shelf - 400MM', 'Mak Rak Standard Shelf - 500MM', 'Mak Rak Standard Shelf - 600MM', 'Mak Rak Starter Pack - 400MM', 'Mak Rok Upright Double - 94MM', 'Mak Rok Upright Single - 56MM', 'White Melamin Shelving - 2440MM', 'White Melamine Shelving - 1830MM'],
  //     [this.imgDir + 'shelves/makRakCrossBrace.jpg', this.imgDir + 'shelves/makRakScrewAllenKeyPack.jpg', this.imgDir + 'shelves/makRakSlimlineShelf_300.jpeg', this.imgDir + 'shelves/makRakSlimlineShelf_400.jpeg', this.imgDir + 'shelves/makRakSlimlineShelf_500.jpeg', this.imgDir + 'shelves/makRakSlimlineShelf_600.jpeg', this.imgDir + 'shelves/makRakStandardShelf_500.jpg', this.imgDir + 'shelves/makRakStandardShelf_400.jpg', this.imgDir + 'shelves/makRakStandardShelf_500.jpg', this.imgDir + 'shelves/makRakStandradShelf_600.jpg', this.imgDir + 'shelves/makRakStarterPack.jpg', this.imgDir + 'shelves/makRakUprightDouble.jpg', this.imgDir + 'shelves/makRakUprightSingle.jpg', this.imgDir + 'shelves/whiteMelaminShelving.jpeg', this.imgDir + 'shelves/whiteMelaminShelving.jpeg'],
  //     [59.95, 29.95, 189.95, 219.95, 289.95, 349.95, 199.95, 249.95, 289.95, 359.95, 1299.00, 69.95, 59.95, 174.95, 119.95],
  //     1
  //   ),
  //   new BuildingMaterial(
  //     'p25',
  //     'Steel Extrusions',
  //     'Building Materials',
  //     'None',
  //     this.directory +  'welder.png',
  //     ['Solid Rod - 3M', 'Solid Square - 3M'],
  //     [this.imgDir + 'steel/solidRod.jpeg', this.imgDir + 'steel/solidRod.jpeg'],
  //     [39.95, 89.95],
  //     1
  //   ),
  // ];

  constructor(private http: HttpClient) { }

  get products() {
    return this._products.asObservable();
  }

  fetchBuildingMaterials() {
    return this.http
      .get<{[key: string]: BuildingMaterialData}>(this.databaseLocation)
      .pipe(map(responseData => {
        const products =[];
        for(const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            products.push(
              new BuildingMaterial(
                key,
                responseData[key].title,
                responseData[key].category,
                responseData[key].description,
                responseData[key].image,
                responseData[key].productTypes,
                responseData[key].productImages,
                responseData[key].productPrices,
                responseData[key].quantity
              ));
            }
          }
        return products;
      }), tap(products => {
        this._products.next(products);
      }));
  }

  getProduct(productId: string) {
    return this.http
      .get<BuildingMaterialData>(`https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/products/building-materials/${productId}.json`)
      .pipe(
        map(productData => new BuildingMaterial(
          productId,
          productData.title,
          productData.category,
          productData.description,
          productData.image,
          productData.productTypes,
          productData.productImages,
          productData.productPrices,
          productData.quantity
        ))
      );
  }

  addFeaturedProduct(buildingMaterial: BuildingMaterial) {
    let generatedId: string;
    const newBuildingMaterial = buildingMaterial;

    return this.http
      .post<{name: string}>(this.databaseLocation, {... newBuildingMaterial, id: null})
      .pipe(
        switchMap(responseData => {
          generatedId = responseData.name;
          return this.products;
        }),
        take(1),
        tap(products => {
          newBuildingMaterial.id = generatedId;
          this._products.next(products.concat(newBuildingMaterial));
        })
      );
  }
}
