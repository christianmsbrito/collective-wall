class Painting < ApplicationRecord
  belongs_to :style
  belongs_to :theme
  belongs_to :composition
  belongs_to :color_palette
  belongs_to :medium
  belongs_to :additional_features
  belongs_to :perspective
end
